import re
from typing import Dict, Any

def apply_identity_mask(resume_data: Dict[str, Any], raw_text: str | None) -> tuple[Dict[str, Any], str | None]:
    """
    Applies aggressive PII (Personally Identifiable Information) masking over candidate data,
    replacing exact identifiers with neural-themed placeholders.
    """
    masked_data = dict(resume_data) if resume_data else {}
    
    # 1. Mask explicit parsed data
    original_name = masked_data.get("name")
    original_email = masked_data.get("email")
    original_phone = masked_data.get("phone")
    
    if original_name:
        masked_data["name"] = f"CANDIDATE_VECTOR_{hash(original_name) % 10000:04d}"
    if original_email:
        masked_data["email"] = "[REDACTED_SECURE_COMMS]"
    if original_phone:
        masked_data["phone"] = "[REDACTED_CONTACT]"
        
    masked_text = raw_text
    
    # 2. Mask the raw text aggressively so the recruiter can't find the name hidden in the text
    if masked_text:
        # Mask emails
        masked_text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[REDACTED_SECURE_COMMS]', masked_text)
        # Mask phones
        masked_text = re.sub(r'[\+]?[\d\s\-\(\)]{10,15}', '[REDACTED_CONTACT]', masked_text)
        # Mask specific name if found
        if original_name and len(original_name) > 3:
            # Case insensitive exact replacement of their name
            pattern = re.compile(re.escape(original_name), re.IGNORECASE)
            masked_text = pattern.sub('[CANDIDATE_ENTITY]', masked_text)
            
            # Sub-replace first name uniquely
            first_name = original_name.split(" ")[0]
            if len(first_name) > 2:
                pattern_fn = re.compile(r'\b' + re.escape(first_name) + r'\b', re.IGNORECASE)
                masked_text = pattern_fn.sub('[CANDIDATE]', masked_text)
                
    return masked_data, masked_text
