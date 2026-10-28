"""
Proposal PDF Generator for SparkStart Round 1 Submission
Compiles the 9 required proposal sections into a formatted, professional PDF document.
"""

from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Preformatted,
    KeepTogether,
)

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PDF = BASE_DIR / "docs" / "SparkStart_Round1_Proposal.pdf"


def generate_pdf():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=45,
        bottomMargin=45,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#166534'),
        alignment=1, # Centered
        spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#4b5563'),
        alignment=1,
        spaceAfter=14,
    )
    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#14532d'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True,
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#1f2937'),
        spaceAfter=6,
    )
    abstract_box_style = ParagraphStyle(
        'AbstractBox',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor('#1e293b'),
    )
    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#0f172a'),
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("SparkStart & SparkBuddy: Round 1 Project Proposal", title_style))
    story.append(Paragraph("Small steps. Real progress. &bull; Track: LLMs & RAG (The Task Sequencer)", subtitle_style))
    story.append(Spacer(1, 4))

    # 1. Team Details
    story.append(Paragraph("1. Team Details", h1_style))
    team_data = [
        [Paragraph("<b>Field</b>", body_style), Paragraph("<b>Details (Please fill in)</b>", body_style)],
        [Paragraph("Team Name", body_style), Paragraph("[Insert Team Name Here]", body_style)],
        [Paragraph("Team Leader", body_style), Paragraph("[Insert Team Leader Name Here] &bull; Email: [Insert Email]", body_style)],
        [Paragraph("Team Member 2", body_style), Paragraph("[Insert Member 2 Name Here] &bull; Email: [Insert Email]", body_style)],
        [Paragraph("Team Member 3", body_style), Paragraph("[Insert Member 3 Name Here] &bull; Email: [Insert Email]", body_style)],
        [Paragraph("Team Member 4", body_style), Paragraph("[Insert Member 4 Name Here] &bull; Email: [Insert Email]", body_style)],
        [Paragraph("Institution / University", body_style), Paragraph("[Insert University / College Name Here]", body_style)],
        [Paragraph("Primary Track", body_style), Paragraph("LLMs & RAG — The Task Sequencer", body_style)],
    ]
    t_team = Table(team_data, colWidths=[130, 390])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#dcfce7')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#14532d')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 8))

    # 2. Brief About the Problem and Idea
    story.append(Paragraph("2. Brief About the Problem and Idea (Abstract)", h1_style))
    abstract_text = (
        "SparkStart is an adaptive, low-pressure task sequencing system paired with SparkBuddy, "
        "a cross-application floating desktop companion. Designed for university students facing executive "
        "dysfunction and task initiation paralysis, SparkStart replaces intimidating 50-step checklists with "
        "evidence-based, 2-minute starter actions calibrated to self-reported energy levels. Utilizing a grounded "
        "Retrieval-Augmented Generation (RAG) architecture anchored in cognitive load and behavioral psychology "
        "literature, the system bridges the gap between intention and performance directly within active desktop "
        "workspaces such as VS Code. SparkStart rejects punitive streaks, aggressive alarms, and diagnostic "
        "overreach in favor of genuine user autonomy, local-first SQLite privacy, and guilt-free restorative pacing."
    )
    t_abstract = Table([[Paragraph(abstract_text, abstract_box_style)]], colWidths=[520])
    t_abstract.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#86efac')),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_abstract)
    story.append(Spacer(1, 8))

    # 3. Proposed Solution and USP
    story.append(Paragraph("3. Proposed Solution and Unique Selling Propositions (USPs)", h1_style))
    story.append(Paragraph(
        "<b>The Solution:</b> SparkStart addresses the psychological hurdle of task initiation rather than enforcing rigid timetables. "
        "Instead of exposing students to long to-do backlogs that induce anxiety freeze, SparkStart isolates a single, observable, "
        "2-to-5 minute starting action supported by a floating desktop companion (SparkBuddy) at the point of performance.",
        body_style,
    ))
    usps = [
        "<b>1. Single-Target Scaffolding:</b> Eliminates working memory saturation by displaying only one active micro-action.",
        "<b>2. Dynamic Energy Pacing:</b> Calibrates tasks to self-reported capacity (Low, Medium, High, Unsure) without guilt or shame.",
        "<b>3. Instant 'Too Big' Shrink Engine:</b> Decomposes resistant tasks recursively down to 60-second friction-free contact actions.",
        "<b>4. Point-of-Performance Companion:</b> Floats on top of VS Code and web browsers without stealing keyboard focus.",
        "<b>5. Evidence-Grounded RAG Pipeline:</b> Recommendations cite genuine psychological findings (Gollwitzer, Sweller, Barkley).",
        "<b>6. Local-First Privacy Sovereignty:</b> Operates 100% offline out-of-the-box with local SQLite persistence and explicit AI consent.",
    ]
    for u in usps:
        story.append(Paragraph(f"&bull; {u}", body_style))
    story.append(Spacer(1, 8))

    # 4. Key Features
    story.append(Paragraph("4. Key Features", h1_style))
    features = [
        ("Adaptive Task Sequencer", "Generates single-action starter commitments with duration tags, manageability rationale, and gentle alternatives."),
        ("SparkBuddy Desktop Mascot", "Electron companion with original animated sprout SVG displaying 5 emotive states (Idle, Encouraging, Thinking, Resting, Celebrating)."),
        ("'Too Big' Action Shrink", "One-click granular decomposition that immediately dissolves perfectionist freeze."),
        ("Guilt-Free Rest Timer", "Configurable 5, 10, or 15-minute recovery intervals with soothing breathing guide and non-enforced return to work."),
        ("Grounded Evidence Drawer", "Transparent literature citations showing peer-reviewed cognitive science foundations for each micro-step."),
        ("Privacy & Sovereignty", "Instant JSON data export and permanent local SQLite database purge."),
    ]
    f_data = [[Paragraph(f"<b>{title}</b>", body_style), Paragraph(desc, body_style)] for title, desc in features]
    t_feat = Table(f_data, colWidths=[150, 370])
    t_feat.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#f8fafc')),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_feat)
    story.append(Spacer(1, 8))

    # 5. Process Flow
    story.append(Paragraph("5. Process Flow / Use-case Diagram", h1_style))
    flow_diagram = """
  [ 1. Energy Check-In ]  --->  [ 2. Enter Task ]  --->  [ 3. RAG Retrieval & Sequencing ]
           |                                                        |
           v                                                        v
  (Low/Med/High/Skip)                                      [ 4. Single Micro-Action ]
                                                          /           |             \\
                                                         /            |              \\
                                           [ Click Done ]    [ Click Too Big ]   [ Rest Break ]
                                                 |                    |                 |
                                                 v                    v                 v
                                           Mascot Celebrates!   Decompose to 1m    5-15m Breathing
                                           Step count + 1       Frictionless Step  Zero Guilt Timer
    """
    story.append(Preformatted(flow_diagram, code_style))
    story.append(Spacer(1, 8))

    # 6. Technical Track and Approach
    story.append(Paragraph("6. Technical Track and Approach (LLMs & RAG)", h1_style))
    story.append(Paragraph(
        "<b>Primary Track:</b> LLMs & RAG — The Task Sequencer.<br/>"
        "<b>Methodology:</b> Rather than using LLMs to hallucinate arbitrary multi-step schedules, SparkStart anchors generation "
        "in an indexed knowledge base of peer-reviewed behavioral research. Chunks are retrieved via token-boosted cosine similarity. "
        "The context is fed to the provider abstraction (Gemini / OpenAI / Mock), which validates structured JSON matching strict "
        "Pydantic schemas. If external networks are absent or remote AI is disabled, the local deterministic sequencer responds in under 5ms.",
        body_style,
    ))
    story.append(Spacer(1, 8))

    # 7. Architecture Diagram
    story.append(Paragraph("7. Architecture Diagram", h1_style))
    arch_diagram = """
  +-----------------------------------------------------------------------------------+
  |                               SYSTEM ARCHITECTURE                                 |
  +-----------------------------------------------------------------------------------+
    [ Web Dashboard ] (React + Vite)        [ Desktop Companion ] (Electron + React)
            \\                                              /
             \\---- (REST API / JSON / localhost:8000) ----/
                                   |
                                   v
             +--------------------------------------------+
             |           FASTAPI BACKEND ENGINE           |
             |   - /api/sequence/next                     |
             |   - /api/sequence/shrink                   |
             |   - SQLite Local Storage (sparkstart.db)   |
             +--------------------------------------------+
                     |                            |
                     v                            v
          [ RAG Retrieval Engine ]      [ AI Provider Factory ]
          - Curated Psychology Base     - Mock Provider (Local/Zero-Key)
          - Cosine Vector Indexing      - Gemini & OpenAI (With Consent)
    """
    story.append(Preformatted(arch_diagram, code_style))
    story.append(Spacer(1, 8))

    # 8. Technologies to Be Used
    story.append(Paragraph("8. Technologies to Be Used", h1_style))
    tech_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Technology Stack</b>", body_style)],
        [Paragraph("Web Dashboard", body_style), Paragraph("React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons", body_style)],
        [Paragraph("Desktop Companion", body_style), Paragraph("Electron 33, React 18, TypeScript, ContextBridge IPC", body_style)],
        [Paragraph("AI / Sequencer Backend", body_style), Paragraph("Python 3.14, FastAPI, Uvicorn, Pydantic v2", body_style)],
        [Paragraph("RAG & Search", body_style), Paragraph("Lightweight Cosine Vector Search, Curated JSON Knowledge Base", body_style)],
        [Paragraph("Local Database", body_style), Paragraph("SQLite3 (Local-first, relational schema)", body_style)],
        [Paragraph("Testing & Quality", body_style), Paragraph("Pytest, TestClient, tsc, Vite build bundler", body_style)],
    ]
    t_tech = Table(tech_data, colWidths=[140, 380])
    t_tech.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 8))

    # 9. Privacy, Ethics and User Experience
    story.append(Paragraph("9. Privacy, Ethics and User Experience", h1_style))
    ethics = [
        "<b>User Autonomy:</b> No punitive streaks, overdue shame alerts, or forced digital lockouts.",
        "<b>Zero Involuntary Transmission:</b> Operates 100% offline out-of-the-box. Remote AI requires opt-in consent.",
        "<b>Zero Intrusive Tracking:</b> No webcam access, gaze tracking, keystroke logging, or background surveillance.",
        "<b>Complete Data Sovereignty:</b> Immediate JSON data export and permanent local SQLite purge options.",
        "<b>Non-Clinical Positioning:</b> Designed as supportive scaffolding; does not claim to diagnose or treat ADHD or anxiety.",
    ]
    for e in ethics:
        story.append(Paragraph(f"&bull; {e}", body_style))

    doc.build(story)
    print(f"Proposal PDF generated successfully at: {OUTPUT_PDF}")


if __name__ == "__main__":
    generate_pdf()

