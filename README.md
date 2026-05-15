# lhc-betterdark

Plugin-style custom theme override for **LiveHelperChat** that:

- enables dark styling on login/admin when the OS is in dark mode,
- keeps compatibility with LHC native dark mode,
- disables the custom dark layer when native UI is explicitly in light mode.

## What this repository contains

- `design/customtheme/css/custom-login-dark.css`  
  BetterDark CSS layer for login and admin surfaces.
- `design/customtheme/js/lhc-betterdark-toggle-bridge.js`  
  Detects dark/light signals and toggles `lhc-betterdark-enabled` on `<html>`.
- `design/customtheme/tpl/pagelayouts/parts/page_head_css_extension_multiinclude.tpl.php`  
  Includes CSS + JS in LHC head extension include point.

## Installation

1. Copy the `design/customtheme` folder from this repo into your LHC installation (`lhc_web/design/customtheme`).
2. Ensure your LHC uses `customtheme` (or merge these files into your active custom design override).
3. Clear LHC cache/template cache.
4. Reload login and admin pages.

## Behaviour

- If there is no explicit light/dark override from LHC UI, BetterDark follows OS preference (`prefers-color-scheme: dark`).
- If LHC sets explicit dark state, BetterDark stays active.
- If LHC sets explicit light state (toggle off), BetterDark is disabled and default light theme is shown.

## Notes

- This repository is intentionally minimal and focused on theme override files only.
- No build step is required.
