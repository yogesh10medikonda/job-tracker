import re
from .skills import SKILLS, ALIAS_TO_CANON


def _pattern(alias: str) -> re.Pattern:
    # whole-word match: "java" must not match inside "javascript",
    # and "js" must not match inside "node.js"
    return re.compile(
        r"(?<![A-Za-z0-9+#.])" + re.escape(alias) + r"(?![A-Za-z0-9+#])",
        re.IGNORECASE,
    )


_PATTERNS = {
    canon: [_pattern(a) for a in {canon, *aliases}]
    for canon, aliases in SKILLS.items()
}


def extract_skills(text: str) -> set[str]:
    return {
        canon
        for canon, patterns in _PATTERNS.items()
        if any(p.search(text) for p in patterns)
    }


def normalize(skill: str) -> str:
    s = skill.strip().lower()
    return ALIAS_TO_CANON.get(s, s)


def analyze(job_description: str, resume_skills: list[str]) -> dict:
    required = extract_skills(job_description)
    have = {normalize(s) for s in resume_skills if s.strip()}

    matched = sorted(required & have)
    missing = sorted(required - have)
    score = round(len(matched) / len(required) * 100) if required else None

    return {
        "matchScore": score,
        "requiredSkills": sorted(required),
        "jobSkills": sorted(required),
        "matchedSkills": matched,
        "missingSkills": missing,
    }