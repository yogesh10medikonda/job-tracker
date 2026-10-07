from app.matcher import analyze

def test_basic_match():
    r = analyze(
        "We need a Python developer with FastAPI, MongoDB, Docker and AWS experience.",
        ["Python", "MongoDB", "Docker"],
    )
    assert r["matchScore"] == 60
    assert r["missingSkills"] == ["aws", "fastapi"]

def test_aliases_are_normalized():
    r = analyze("Looking for Node.js and React skills.", ["NodeJS", "React"])
    assert r["matchScore"] == 100
    assert r["missingSkills"] == []

def test_java_is_not_javascript():
    r = analyze("JavaScript developer needed.", ["Java"])
    assert r["matchScore"] == 0
    assert "javascript" in r["missingSkills"]