# Eight-direction movement

The original developer's [modern port description](https://store.steampowered.com/app/4313160/Castle_of_the_Winds/) identifies keypad and classic rogue movement. The [documented original controls](https://strategywiki.org/wiki/Castle_of_the_Winds/Controls) specify eight keypad directions and bump combat.

This slice adds keypad 1–9 (except 5), diagonal buttons and adjacent-tile clicks. Both player and pursuing enemies can step diagonally and strike adjacent opponents. Each valid action consumes one beat. A diagonal cannot pass if either orthogonal side is a wall; this explicit corner rule is a project choice, not independently verified original behavior. Bolt, Blink, visibility and detection retain their existing Manhattan ranges. Existing saves use the same positions and schema.
