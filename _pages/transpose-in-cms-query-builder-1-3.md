---
title: "Transpose in CMS Query Builder. Working with Complex Properties in BO CMS Database."
date: 2019-03-07T12:00:00+00:00
weight: 3
---

In a standard database, each field of a row contains a single value. However, this is not the case for BO CMS (Business Objects Central Management Server) database. A property in BO CMS can have a quite complex structure. For example, consider the `SI_DSL_UNIVERSE` property for Web Intelligence documents that indicates what Unx universes are used by the document.

```sql
SELECT si_name, si_universe, si_dsl_universe
FROM ci_infoobjects
WHERE si_kind = 'Webi'
AND si_instance = 0
AND si_name = 'Customer Profitability Comparison, by Customer'
```

The result in the SAP BO Query Builder will look like this:

![Query Builder Result](/images/pages/transpose-01.png)

When exporting metadata for such an object using "Include containers" in Biclever CMS Query Builder, it will create a single row, and the fields for the property will be `SI_DSL_UNIVERSE.1`, `SI_DSL_UNIVERSE.2`, `SI_DSL_UNIVERSE.3`, `SI_DSL_UNIVERSE.SI_TOTAL`.

![Exported Metadata](/images/pages/transpose-02.png)

The wide format of this data is sometimes inconvenient. To address this, you can use the "Transpose" operation, which will create a row for each value of each array.

![Transposed Data](/images/pages/transpose-03.png)
