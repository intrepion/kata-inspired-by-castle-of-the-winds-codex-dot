# A synchronous action boundary owns expedition time
All gameplay transitions pass through a synchronous state-to-state action function. This makes menu isolation, replay, persistence and turn costs independently testable. Failed actions return without advancing time; enemies respond only after committed actions, and travel never grants an arrival attack.
