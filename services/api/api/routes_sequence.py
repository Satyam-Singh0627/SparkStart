"""
Task Sequencing Routes
Produces the smallest useful next action and granular shrink decomposition.
"""

from fastapi import APIRouter, HTTPException
from services.api.schemas.sequence import SequenceRequest, SequenceResponse, ShrinkRequest
from services.api.services.sequencer_service import sequencer_service

router = APIRouter(prefix="/sequence", tags=["Sequencing"])


@router.post("/next", response_model=SequenceResponse)
async def generate_next_step(req: SequenceRequest):
    try:
        return await sequencer_service.get_next_step(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate next step: {str(e)}")


@router.post("/shrink", response_model=SequenceResponse)
async def shrink_step(req: ShrinkRequest):
    try:
        return await sequencer_service.shrink_step(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to shrink step: {str(e)}")

