import re

from .skills import SKILLS, ALIAS_TO_CANON


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("-", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_skills(text: str) -> list[str]:
    normalized_text = normalize(text)

    found = set()

    for skill in SKILLS:
        normalized_skill = normalize(skill)

        pattern = r"(?<!\w)" + re.escape(normalized_skill) + r"(?!\w)"

        if re.search(pattern, normalized_text):
            canonical = ALIAS_TO_CANON.get(skill, skill)
            found.add(canonical)

    return sorted(found)


def analyze(job_description: str, resume_skills: list[str]):
    job_skills = extract_skills(job_description)

    resume_normalized = {
        ALIAS_TO_CANON.get(normalize(skill), normalize(skill))
        for skill in resume_skills
    }

    matched_skills = [
        skill for skill in job_skills
        if skill in resume_normalized
    ]

    missing_skills = [
        skill for skill in job_skills
        if skill not in resume_normalized
    ]

    if job_skills:
        match_score = round(
            (len(matched_skills) / len(job_skills)) * 100
        )
    else:
        match_score = 0

    return {
        "jobSkills": job_skills,
        "matchedSkills": sorted(matched_skills),
        "missingSkills": sorted(missing_skills),
        "matchScore": match_score,
    }