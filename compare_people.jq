# Read both JSON files
. as $edited |
$original as $people |

# Extract the identifiers from edited.json's people array
($edited | .people | map(.id)) as $edited_ids |

# Extract the identifiers from people.json
($people | map(.id)) as $people_ids |

# Find ids in people.json that are not in edited.json's people array
$people_ids - $edited_ids as $missing_ids |

# Match the missing ids with their full records in people.json for detailed output
($people | .[] | select(.id as $id | $missing_ids | index($id) != null)) as $missing_people |

# Output the missing people with their names
$missing_people | "Missing: \(.firstName) \(.lastName) (ID: \(.id))"
