{for entry in successResult}
**{entry.site.strName}:**
{for ea in entry.locations}
- {ea.strName}: {ea.id}
{endfor}
{endfor}