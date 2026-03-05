"""NLP preprocessing service - tokenization, normalization, and text cleaning."""

import re


def clean_text(text: str) -> str:
    """Clean and normalize text for NLP processing."""
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s\+\#\.]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# Maps a canonical skill name to all its known variants/aliases.
# When we find ANY variant in text, we report the canonical name.
SKILL_VARIANTS = {
    "python": ["python", "python3", "python 3"],
    "java": ["java", "java8", "java 8", "java11", "java 11", "java17"],
    "javascript": ["javascript", "java script", "js", "es6", "es2015", "ecmascript"],
    "typescript": ["typescript", "type script", "ts"],
    "c++": ["c++", "cpp", "c plus plus"],
    "c#": ["c#", "csharp", "c sharp", "c-sharp"],
    "c": ["\\bc\\b"],  # regex mode — word boundary match
    "ruby": ["ruby"],
    "go": ["golang", "go lang"],
    "rust": ["rust", "rustlang"],
    "swift": ["swift"],
    "kotlin": ["kotlin"],
    "php": ["php"],
    "scala": ["scala"],
    "r": ["\\br\\b", "r programming", "r language"],
    "dart": ["dart"],
    "react": ["react", "reactjs", "react.js", "react js"],
    "angular": ["angular", "angularjs", "angular.js", "angular js"],
    "vue": ["vue", "vuejs", "vue.js", "vue js"],
    "next.js": ["next.js", "nextjs", "next js"],
    "nuxt": ["nuxt", "nuxtjs", "nuxt.js"],
    "svelte": ["svelte", "sveltekit"],
    "node.js": ["node.js", "nodejs", "node js", "node"],
    "express": ["express", "expressjs", "express.js"],
    "django": ["django"],
    "flask": ["flask"],
    "fastapi": ["fastapi", "fast api"],
    "spring": ["spring", "spring boot", "springboot"],
    "laravel": ["laravel"],
    "rails": ["rails", "ruby on rails"],
    ".net": [".net", "dotnet", "dot net", "asp.net"],
    "sql": ["sql"],
    "postgresql": ["postgresql", "postgres", "psql"],
    "mongodb": ["mongodb", "mongo", "mongo db"],
    "mysql": ["mysql", "my sql"],
    "sqlite": ["sqlite"],
    "redis": ["redis"],
    "elasticsearch": ["elasticsearch", "elastic search", "elastic"],
    "firebase": ["firebase"],
    "dynamodb": ["dynamodb", "dynamo db"],
    "aws": ["aws", "amazon web services"],
    "azure": ["azure", "microsoft azure"],
    "gcp": ["gcp", "google cloud", "google cloud platform"],
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "terraform": ["terraform"],
    "ansible": ["ansible"],
    "jenkins": ["jenkins"],
    "github actions": ["github actions", "gh actions"],
    "ci/cd": ["ci/cd", "ci cd", "cicd", "continuous integration", "continuous deployment"],
    "git": ["git", "github", "gitlab", "bitbucket"],
    "linux": ["linux", "ubuntu", "centos", "debian"],
    "machine learning": ["machine learning", "ml", "machine-learning"],
    "deep learning": ["deep learning", "dl", "deep-learning"],
    "nlp": ["nlp", "natural language processing"],
    "computer vision": ["computer vision", "cv", "image recognition", "object detection"],
    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch", "torch"],
    "keras": ["keras"],
    "scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "opencv": ["opencv", "open cv"],
    "html": ["html", "html5"],
    "css": ["css", "css3"],
    "sass": ["sass", "scss"],
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
    "bootstrap": ["bootstrap"],
    "material ui": ["material ui", "mui", "material-ui"],
    "rest api": ["rest api", "restful", "rest", "restful api"],
    "graphql": ["graphql", "graph ql"],
    "grpc": ["grpc"],
    "microservices": ["microservices", "micro services", "microservice"],
    "agile": ["agile"],
    "scrum": ["scrum"],
    "jira": ["jira"],
    "figma": ["figma"],
    "power bi": ["power bi", "powerbi"],
    "tableau": ["tableau"],
    "excel": ["excel", "ms excel", "microsoft excel"],
    "data analysis": ["data analysis", "data analytics", "data analyst"],
    "data science": ["data science", "data scientist"],
    "hadoop": ["hadoop"],
    "spark": ["spark", "apache spark", "pyspark"],
    "kafka": ["kafka", "apache kafka"],
    "api": ["api", "apis"],
    "oauth": ["oauth", "oauth2", "oauth 2.0"],
    "jwt": ["jwt", "json web token"],
    "selenium": ["selenium"],
    "cypress": ["cypress"],
    "jest": ["jest"],
    "pytest": ["pytest"],
    "unity": ["unity", "unity3d"],
    "unreal": ["unreal", "unreal engine"],
    "flutter": ["flutter"],
    "react native": ["react native", "react-native"],
    "android": ["android"],
    "ios": ["ios"],
    "wordpress": ["wordpress"],
    "shopify": ["shopify"],
}

# Build a reverse lookup: variant → canonical name
_VARIANT_TO_CANONICAL = {}
_REGEX_SKILLS = {}  # for skills that need regex matching (like "c", "r")
for canonical, variants in SKILL_VARIANTS.items():
    for variant in variants:
        if variant.startswith("\\b"):
            _REGEX_SKILLS[canonical] = variant
        else:
            _VARIANT_TO_CANONICAL[variant] = canonical


def extract_skills(text: str) -> list[str]:
    """Extract skills from text using variant-aware matching."""
    text_lower = text.lower()
    found = set()

    # Check all known variants
    for variant, canonical in _VARIANT_TO_CANONICAL.items():
        if variant in text_lower:
            found.add(canonical)

    # Check regex-based skills (single-letter languages like C, R)
    for canonical, pattern in _REGEX_SKILLS.items():
        if re.search(pattern, text_lower):
            found.add(canonical)

    return list(found)


def normalize_skill(skill: str) -> str:
    """Normalize a skill name to its canonical form."""
    skill_lower = skill.lower().strip()

    # Direct match in variants
    if skill_lower in _VARIANT_TO_CANONICAL:
        return _VARIANT_TO_CANONICAL[skill_lower]

    # Check if it's already a canonical name
    if skill_lower in SKILL_VARIANTS:
        return skill_lower

    return skill_lower
