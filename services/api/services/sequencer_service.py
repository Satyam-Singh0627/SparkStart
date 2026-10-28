"""
Task Sequencer Service
Central business logic for adaptive micro-step decomposition, RAG grounding, and persistence.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List

from services.api.config import settings
from services.api.rag.engine import rag_engine
from services.api.ai.factory import get_ai_provider
from services.api.storage.repository import repository
from services.api.schemas.sequence import SequenceRequest, SequenceResponse, ShrinkRequest
from services.api.schemas.task import KnowledgeSourceRef


class TaskSequencerService:
    def __init__(self):
        self.rag = rag_engine

    async def get_next_step(self, req: SequenceRequest) -> SequenceResponse:
        # 0. If taskId is provided and no specific obstacle was given, check for existing pending subtask
        if req.taskId and not req.obstacle:
            existing_task = repository.get_task(req.taskId)
            if existing_task and existing_task.currentMicroTask:
                m = existing_task.currentMicroTask
                now_str = datetime.now(timezone.utc).isoformat()
                return SequenceResponse(
                    taskId=req.taskId,
                    stepId=m.id,
                    stepOrder=m.stepOrder or 1,
                    totalSteps=existing_task.totalStepsCount or len(existing_task.subtasks),
                    actionText=m.actionText,
                    suggestedDurationMinutes=m.suggestedDurationMinutes,
                    encouragement=m.encouragement,
                    whyItIsManageable=m.whyItIsManageable,
                    alternativeSmallerStep=m.alternativeSmallerStep or "Take a slow breath and open the workspace.",
                    sourceReferences=m.sourceReferences,
                    isFallback=m.isFallback,
                    timestamp=now_str,
                )

        # 1. Formulate search query for RAG
        search_terms = f"{req.taskTitle} {req.energyLevel or ''} {req.obstacle or ''} initiation micro-step"
        retrieved_results = self.rag.search(search_terms, top_k=settings.rag_top_k)
        retrieved_context = self.rag.format_retrieval_context(retrieved_results)

        source_refs: List[KnowledgeSourceRef] = []
        for chunk, score in retrieved_results:
            source_refs.append(
                KnowledgeSourceRef(
                    id=chunk.source_id,
                    title=chunk.source_title,
                    sourceUrl=chunk.source_url,
                    excerpt=chunk.text[:180] + "...",
                )
            )

        # 2. Invoke AI Provider
        provider = get_ai_provider()
        ai_result = await provider.generate_micro_step(
            task_title=req.taskTitle,
            energy_level=req.energyLevel or "unsure",
            obstacle=req.obstacle,
            retrieved_context=retrieved_context,
            is_shrink_request=False,
            current_step_text=req.currentStepText,
        )

        is_fallback = provider.provider_name == "mock" or not settings.enable_remote_ai

        # 3. Save to database if taskId provided
        saved_m = None
        if req.taskId:
            saved_m = repository.save_micro_task(
                task_id=req.taskId,
                action_text=ai_result["actionText"],
                suggested_duration_minutes=int(ai_result.get("suggestedDurationMinutes", 3)),
                encouragement=ai_result.get("encouragement", "Small steps."),
                why_manageable=ai_result.get("whyItIsManageable", "Low barrier action."),
                alternative_step=ai_result.get("alternativeSmallerStep", ""),
                source_refs=[ref.model_dump() for ref in source_refs],
                is_fallback=is_fallback,
            )

        now_str = datetime.now(timezone.utc).isoformat()
        return SequenceResponse(
            taskId=req.taskId,
            stepId=saved_m.id if saved_m else None,
            stepOrder=saved_m.stepOrder if saved_m else 1,
            totalSteps=4,
            actionText=ai_result["actionText"],
            suggestedDurationMinutes=int(ai_result.get("suggestedDurationMinutes", 3)),
            encouragement=ai_result.get("encouragement", "Small steps."),
            whyItIsManageable=ai_result.get("whyItIsManageable", "Manageable starting action."),
            alternativeSmallerStep=ai_result.get("alternativeSmallerStep", "Open the task and take one deep breath."),
            sourceReferences=source_refs,
            isFallback=is_fallback,
            timestamp=now_str,
        )

    async def shrink_step(self, req: ShrinkRequest) -> SequenceResponse:
        # Retrieve guidance specifically on granular decomposition
        search_terms = f"too big overload chunking {req.taskTitle} micro-step"
        retrieved_results = self.rag.search(search_terms, top_k=2)
        retrieved_context = self.rag.format_retrieval_context(retrieved_results)

        source_refs: List[KnowledgeSourceRef] = [
            KnowledgeSourceRef(
                id=c.source_id,
                title=c.source_title,
                sourceUrl=c.source_url,
                excerpt=c.text[:180] + "...",
            )
            for c, _ in retrieved_results
        ]

        provider = get_ai_provider()
        ai_result = await provider.generate_micro_step(
            task_title=req.taskTitle,
            energy_level=req.energyLevel or "low",
            obstacle=req.obstacle,
            retrieved_context=retrieved_context,
            is_shrink_request=True,
            current_step_text=req.currentActionText,
        )

        is_fallback = provider.provider_name == "mock" or not settings.enable_remote_ai

        if req.taskId:
            repository.save_micro_task(
                task_id=req.taskId,
                action_text=ai_result["actionText"],
                suggested_duration_minutes=int(ai_result.get("suggestedDurationMinutes", 1)),
                encouragement=ai_result.get("encouragement", "Let's make it tiny."),
                why_manageable=ai_result.get("whyItIsManageable", "Near-zero demand step."),
                alternative_step=ai_result.get("alternativeSmallerStep", ""),
                source_refs=[ref.model_dump() for ref in source_refs],
                is_fallback=is_fallback,
            )

        now_str = datetime.now(timezone.utc).isoformat()
        return SequenceResponse(
            taskId=req.taskId,
            actionText=ai_result["actionText"],
            suggestedDurationMinutes=int(ai_result.get("suggestedDurationMinutes", 1)),
            encouragement=ai_result.get("encouragement", "Let's make it tiny."),
            whyItIsManageable=ai_result.get("whyItIsManageable", "Near-zero demand step."),
            alternativeSmallerStep=ai_result.get("alternativeSmallerStep", "Rest your eyes for 30 seconds."),
            sourceReferences=source_refs,
            isFallback=is_fallback,
            timestamp=now_str,
        )


sequencer_service = TaskSequencerService()

