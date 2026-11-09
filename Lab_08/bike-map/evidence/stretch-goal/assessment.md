# The other end
Implemented a keyboard-accessible starting/ending radio switch, driven by one shared direction state. All views use the chosen endpoint filter; counterpart lists switch from destinations to origins. All original records remain in memory. Hourly y-axis bounds are shared between both modes at each pin location.

At Kendall, 12 docks are selected. Starting mode: 5615 weekly trips, 34.4 weekday trips/day at 08:00 and 150.2 at 17:00. Ending mode: 5933 weekly trips, 209.2 at 08:00 and 51.8 at 17:00. All hourly values refer to departure hour, including trips ending at Kendall; no arrival timestamp is supplied.

The pattern is consistent with morning travel toward Kendall and evening travel away, as expected around a work or study destination. It does not identify individual riders, occupations, or trip purposes.

Production build passed. Chrome tests verified both endpoint modes against computed data, counts, origin/destination lists, unchanged 732 station marks, keyboard switching, and changes of pin location. No page/console errors. Screenshots: kendall-start.png and kendall-end.png. Raw values and browser results are saved alongside this report.
