"""
High-Fidelity Mock AI Provider for SparkStart
Runs 100% offline, locally, and deterministically without external API keys or remote data transfer.
Generates genuine, tailored micro-steps adapted to task topic, energy levels, and shrink requests.
"""

import re
from typing import Dict, Any
from services.api.ai.base import BaseAIProvider


class MockAIProvider(BaseAIProvider):
    @property
    def provider_name(self) -> str:
        return "mock"

    async def generate_micro_step(
        self,
        task_title: str,
        energy_level: str,
        obstacle: str | None,
        retrieved_context: str,
        is_shrink_request: bool = False,
        current_step_text: str | None = None,
    ) -> Dict[str, Any]:
        title_lower = task_title.lower()
        energy = (energy_level or "unsure").lower()

        # Duration configuration based on energy
        duration_map = {
            "low": 2,
            "unsure": 3,
            "medium": 7,
            "high": 12,
        }
        duration = duration_map.get(energy, 3)

        # Handle 'Too Big' shrink requests
        if is_shrink_request:
            return self._handle_shrink(task_title, current_step_text, energy)

        # Detect domain categories
        is_coding = any(k in title_lower for k in ["code", "react", "python", "bug", "build", "frontend", "api", "git", "project", "program"])
        is_academic = any(k in title_lower for k in ["dbms", "study", "assignment", "exam", "reading", "math", "chapter", "lecture", "homework", "control systems"])
        is_writing = any(k in title_lower for k in ["write", "essay", "report", "paper", "documentation", "doc", "draft", "proposal"])
        is_career = any(k in title_lower for k in ["internship", "resume", "apply", "job", "portfolio", "cover letter", "linkedin"])
        is_chores = any(k in title_lower for k in ["clean", "room", "wash", "dishes", "laundry", "organize", "trash"])

        if is_coding:
            if energy == "low":
                action = f"Open your code editor and look at the project folder for '{task_title}'. Don't write code yet."
                duration = 2
                manageable = "Simply looking at the workspace establishes sensory familiarization without asking for complex logic."
                alt = "Just launch VS Code or your terminal and let it sit open."
            elif energy == "medium":
                action = f"Write a single comment or function signature in your project outlining the next component."
                duration = 6
                manageable = "Defining one comment guides your focus without requiring full implementation right now."
                alt = "Open the relevant file and read the last 5 lines you edited."
            else:
                action = f"Run your build or test suite once, then fix or draft the first isolated helper function."
                duration = 12
                manageable = "A clear test output gives an immediate, concrete target to solve."
                alt = "Write the interface or type definitions for the feature."

        elif is_academic:
            if energy == "low":
                action = f"Open the assignment document or syllabus for '{task_title}' and read just question number 1."
                duration = 2
                manageable = "Reading a single sentence requires near-zero executive activation energy."
                alt = "Find where the assignment PDF or link is saved on your desktop."
            elif energy == "medium":
                action = f"Skim the first section or question and jot down two bullet points of what it is asking."
                duration = 8
                manageable = "Jotting keywords offloads working memory before you commit to drafting answers."
                alt = "Read just the introduction section."
            else:
                action = f"Draft the solution to the first question or summarize the key concept of the chapter."
                duration = 15
                manageable = "Focusing on exactly one question creates tangible momentum."
                alt = "Review your class notes for the core formulas."

        elif is_writing:
            if energy == "low":
                action = f"Open a blank document, give it a title related to '{task_title}', and write one sentence."
                duration = 3
                manageable = "A single sentence breaks the intimidating blank page."
                alt = "Just create and save the document with a working file name."
            else:
                action = f"Jot down 3 quick, unedited bullet points for what you want to cover."
                duration = 6
                manageable = "Bullet points don't have to be pretty or grammatical; they just capture ideas."
                alt = "Write down one single core idea or question you want to answer."

        elif is_career:
            if energy == "low":
                action = f"Open your resume document or the job posting tab for '{task_title}'. Just read the role title."
                duration = 2
                manageable = "You do not have to apply or write a cover letter right now. Just view the posting."
                alt = "Bookmark the link in your browser."
            else:
                action = f"Review the required skills on one posting and check off two items you already know."
                duration = 7
                manageable = "Validating your existing qualifications builds confidence without overwhelm."
                alt = "Open your resume and check that your contact email is current."

        elif is_chores:
            action = f"Pick up or organize exactly one item in your space related to '{task_title}'."
            duration = 2
            manageable = "One physical movement takes under 60 seconds and relieves spatial pressure."
            alt = "Just stand up, stretch your arms, and look at the space."

        else:
            # Generic fallback adapted to title
            if energy == "low":
                action = f"Take one low-stakes step: open the workspace, tab, or notes for '{task_title}'."
                duration = 2
                manageable = "Arriving at the material is 80% of the initiation battle."
                alt = "Take a slow breath, clear a small space on your desk, and open one related file."
            elif energy == "high":
                action = f"Spend 10 focused minutes drafting or preparing the first milestone of '{task_title}'."
                duration = 10
                manageable = "A 10-minute sprint has a clear finish line and won't exhaust your energy."
                alt = "Outline the next 2 small sub-actions on a piece of paper."
            else:
                action = f"Spend 5 minutes on the very first sub-part of '{task_title}'. Stop as soon as the timer ends."
                duration = 5
                manageable = "5 minutes is safe, bounded, and low pressure."
                alt = "Read or inspect the first requirement."

        encouragement = self._get_encouragement(energy, obstacle)

        return {
            "actionText": action,
            "suggestedDurationMinutes": duration,
            "encouragement": encouragement,
            "whyItIsManageable": manageable,
            "alternativeSmallerStep": alt,
        }

    def _handle_shrink(self, task_title: str, current_step: str | None, energy: str) -> Dict[str, Any]:
        """Produce an ultra-micro step when a user clicks 'Too Big'."""
        curr = (current_step or task_title).lower()
        if "read" in curr or "open" in curr:
            action = f"Don't read anything yet. Just open the app or document for '{task_title}', look at the title, and close your eyes for 3 deep breaths."
            duration = 1
            manageable = "Taking the cognitive demand down to zero breaks physical task freeze."
            alt = "Just place your hand on your keyboard or mouse."
        elif "write" in curr or "code" in curr:
            action = f"Don't write any content. Just type 3 random letters or a placeholder comment, then stop."
            duration = 1
            manageable = "Proving to your nervous system that typing is safe removes perfectionist friction."
            alt = "Open the text editor and set the font or zoom."
        else:
            action = f"Make it tiny: just spend 60 seconds glancing at '{task_title}', with full permission to stop."
            duration = 1
            manageable = "One minute is physically painless and requires no decision-making."
            alt = "Grab a sip of water and look out the window for 30 seconds."

        return {
            "actionText": action,
            "suggestedDurationMinutes": duration,
            "encouragement": "It is completely okay that the last step felt too heavy. Let's make this nearly weightless.",
            "whyItIsManageable": manageable,
            "alternativeSmallerStep": alt,
        }

    def _get_encouragement(self, energy: str, obstacle: str | None) -> str:
        if obstacle:
            return f"Feeling stuck because '{obstacle}' is very understandable. You don't have to solve everything at once."
        if energy == "low":
            return "Honor where your energy is right now. Tiny progress is real progress."
        if energy == "high":
            return "You have good momentum today. Let's direct it into one smooth, clear win."
        return "Small steps. Take your time, there is zero rush or judgment."

    async def generate_task_plan(
        self,
        task_title: str,
        energy_level: str,
        retrieved_context: str = "",
    ) -> list[Dict[str, Any]]:
        """
        Decomposes a task into 3-4 sequential, concrete, low-friction micro-steps.
        Each step has stepOrder, actionText, suggestedDurationMinutes, encouragement,
        whyItIsManageable, and alternativeSmallerStep.
        """
        t_lower = task_title.lower()
        energy = (energy_level or "unsure").lower()

        is_coding = any(k in t_lower for k in ["code", "react", "python", "bug", "build", "frontend", "api", "git", "project", "program", "app", "sql"])
        is_academic = any(k in t_lower for k in ["dbms", "study", "assignment", "exam", "reading", "math", "chapter", "lecture", "homework", "control systems", "quiz"])
        is_writing = any(k in t_lower for k in ["write", "essay", "report", "paper", "documentation", "doc", "draft", "proposal"])
        is_career = any(k in t_lower for k in ["internship", "resume", "apply", "job", "portfolio", "cover letter", "linkedin"])

        if is_coding:
            steps = [
                {
                    "stepOrder": 1,
                    "actionText": f"Open your code editor and navigate to '{task_title}'. Just view the project tree.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "Zero coding required yet. Just arriving at the project lowers activation energy.",
                    "whyItIsManageable": "Visual familiarization overcomes task avoidance without requiring working memory.",
                    "alternativeSmallerStep": "Just launch VS Code or your terminal window.",
                },
                {
                    "stepOrder": 2,
                    "actionText": f"Add a single comment or TODO note in the target file outlining the first small change.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "Drafting a quick comment establishes your anchor point.",
                    "whyItIsManageable": "Comments require zero syntax debugging and structure your thinking.",
                    "alternativeSmallerStep": "Read the last 10 lines of code you worked on.",
                },
                {
                    "stepOrder": 3,
                    "actionText": f"Write or adjust the first isolated function or component for '{task_title}'.",
                    "suggestedDurationMinutes": 5,
                    "encouragement": "Focus only on this single isolated block. Ignore the rest of the application.",
                    "whyItIsManageable": "Single-target focus prevents cognitive overload.",
                    "alternativeSmallerStep": "Write just the type signature or parameter list.",
                },
                {
                    "stepOrder": 4,
                    "actionText": "Run the project or linter once to verify your small addition compiles cleanly.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "A green terminal output or error trace gives a clear, bounded checkpoint.",
                    "whyItIsManageable": "Verifying now locks in your win and prevents debugging debt.",
                    "alternativeSmallerStep": "Save the file and commit your progress.",
                },
            ]
        elif is_academic:
            steps = [
                {
                    "stepOrder": 1,
                    "actionText": f"Open the assignment prompt, textbook, or syllabus for '{task_title}'. Read question 1 only.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "You do not have to finish the assignment today. Just read one prompt.",
                    "whyItIsManageable": "Reading one sentence takes 30 seconds and eliminates anticipation dread.",
                    "alternativeSmallerStep": "Locate the file or book on your desk or screen.",
                },
                {
                    "stepOrder": 2,
                    "actionText": f"Jot down 2 bullet points or formulas needed to solve the first question.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "Bullet points offload working memory onto paper so you feel lighter.",
                    "whyItIsManageable": "Notes don't have to be neat; they just capture initial thoughts.",
                    "alternativeSmallerStep": "Highlight the key terms in the question.",
                },
                {
                    "stepOrder": 3,
                    "actionText": f"Draft the solution to question 1 or summarize the core theorem for '{task_title}'.",
                    "suggestedDurationMinutes": 5,
                    "encouragement": "One completed question gives you genuine momentum.",
                    "whyItIsManageable": "Working on a bounded problem creates immediate self-efficacy.",
                    "alternativeSmallerStep": "Write down just the first formula and known variables.",
                },
                {
                    "stepOrder": 4,
                    "actionText": "Quickly check your draft against your class notes and save your document.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "You did it! Lock in this step and celebrate a real win.",
                    "whyItIsManageable": "Checking now ensures you won't have to restart from scratch next time.",
                    "alternativeSmallerStep": "Save the document with a clear filename.",
                },
            ]
        elif is_writing:
            steps = [
                {
                    "stepOrder": 1,
                    "actionText": f"Open a blank document, give it the title '{task_title}', and write one sentence.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "A single sentence breaks the blank page barrier effortlessly.",
                    "whyItIsManageable": "One sentence is non-threatening and establishes immediate progress.",
                    "alternativeSmallerStep": "Create the file and write just the title.",
                },
                {
                    "stepOrder": 2,
                    "actionText": "Draft 3 quick bullet points of the main ideas you want to communicate.",
                    "suggestedDurationMinutes": 4,
                    "encouragement": "Don't edit or judge your ideas yet. Just let them flow out.",
                    "whyItIsManageable": "Bullet points bypass writer's block and perfectionism.",
                    "alternativeSmallerStep": "Write one single question your document will answer.",
                },
                {
                    "stepOrder": 3,
                    "actionText": "Turn the first bullet point into a short, 3-to-4 sentence paragraph.",
                    "suggestedDurationMinutes": 5,
                    "encouragement": "You are fleshing out one small idea at a time.",
                    "whyItIsManageable": "One paragraph is bounded and tangible.",
                    "alternativeSmallerStep": "Expand the bullet point by adding 2 detail words.",
                },
                {
                    "stepOrder": 4,
                    "actionText": "Read through your paragraph once, fix any obvious typo, and save.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "Reviewing locks in the feeling of accomplishment.",
                    "whyItIsManageable": "A quick pass provides closure without exhausting energy.",
                    "alternativeSmallerStep": "Just save the document.",
                },
            ]
        elif is_career:
            steps = [
                {
                    "stepOrder": 1,
                    "actionText": f"Open your resume or the job listing tab for '{task_title}'. Just read the role title.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "Zero pressure to apply right now. Just review the posting.",
                    "whyItIsManageable": "Looking at the tab takes 60 seconds and builds familiarity.",
                    "alternativeSmallerStep": "Bookmark the posting link in your browser.",
                },
                {
                    "stepOrder": 2,
                    "actionText": "Review the required skills and note down 2 things you already know well.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "Validating your qualifications boosts your confidence.",
                    "whyItIsManageable": "Focusing on what you already possess prevents imposter syndrome.",
                    "alternativeSmallerStep": "Highlight one line in the job description.",
                },
                {
                    "stepOrder": 3,
                    "actionText": f"Tailor 1 bullet point on your resume or draft a 3-sentence introduction for '{task_title}'.",
                    "suggestedDurationMinutes": 5,
                    "encouragement": "One targeted paragraph is all you need for real progress.",
                    "whyItIsManageable": "Small edits feel achievable and rewarding.",
                    "alternativeSmallerStep": "Check that your phone and email on your resume are correct.",
                },
                {
                    "stepOrder": 4,
                    "actionText": "Save your updated resume as a PDF draft ready for submission.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "You have a ready-to-go asset. That is a major milestone!",
                    "whyItIsManageable": "Exporting locks in your effort and leaves you prepared.",
                    "alternativeSmallerStep": "Save the editable draft document.",
                },
            ]
        else:
            steps = [
                {
                    "stepOrder": 1,
                    "actionText": f"Prepare the space: open the document, website, or workspace for '{task_title}'.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "Just getting into position is half the victory.",
                    "whyItIsManageable": "No deep thinking required; simply open the workspace.",
                    "alternativeSmallerStep": "Clear a small space on your desk or browser bar.",
                },
                {
                    "stepOrder": 2,
                    "actionText": f"Identify and write down the single easiest first component of '{task_title}'.",
                    "suggestedDurationMinutes": 3,
                    "encouragement": "Pinpointing one small target eliminates decision paralysis.",
                    "whyItIsManageable": "Naming the first step reduces extraneous cognitive load.",
                    "alternativeSmallerStep": "Pick the part that feels least stressful.",
                },
                {
                    "stepOrder": 3,
                    "actionText": f"Spend 5 focused minutes on that easiest component of '{task_title}'.",
                    "suggestedDurationMinutes": 5,
                    "encouragement": "Give yourself permission to stop as soon as 5 minutes are up.",
                    "whyItIsManageable": "Time-boxing makes the task finite and non-threatening.",
                    "alternativeSmallerStep": "Work for just 2 minutes on it.",
                },
                {
                    "stepOrder": 4,
                    "actionText": "Check off what you did, write a 1-line note of what comes next, and save.",
                    "suggestedDurationMinutes": 2,
                    "encouragement": "Leaving a breadcrumb note makes restarting later completely effortless.",
                    "whyItIsManageable": "Capturing context prevents losing your train of thought.",
                    "alternativeSmallerStep": "Just save your current work.",
                },
            ]

        # Calibrate durations if low energy
        if energy == "low":
            for s in steps:
                s["suggestedDurationMinutes"] = max(1, min(3, s["suggestedDurationMinutes"]))

        return steps

