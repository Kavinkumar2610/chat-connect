# ChatConnect

ChatConnect is an Android app for starting a WhatsApp chat with a number you haven't saved, and for calling through a list of numbers from a CSV file. It is built with Ionic 9, Angular 22 and Capacitor 8.

## Features

- WhatsApp. Pick a country from a searchable list of 245 regions (bundled, so it works offline), type a local number or paste a full `+` number, and optionally pre-fill the first message. Recent chats stay on the device; tap one to reuse it.
- Call Dialer. Import a CSV file with a `phone` column, then dial the numbers in turn or tap any number to call it.
- Light and dark mode. The app follows the phone's setting until you use the switch on the Home screen, then remembers your choice.
- Telegram and WeChat are listed on Home as coming soon. Their screens exist at `/telegram` and `/wechat` but aren't linked yet.

## Requirements

- Node.js 22.22.3 or later (Angular 22 also accepts 24.15 or later, and 26 or later)
- For Android builds, JDK 21 and the Android SDK. Android Studio installs both.

## Run in the browser

```bash
npm install
npm start
```

Open http://localhost:4200. Capacitor plugins fall back to web behaviour, so WhatsApp links open in a new tab and `tel:` links are handed to the browser.

## Build the Android app

```bash
npm run build          # web assets into www/
npx cap sync android   # copy www/ and the plugins into android/
npx cap open android   # open in Android Studio
```

To build a debug APK from the command line instead:

```bash
cd android
./gradlew assembleDebug
```

The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. If Gradle can't find the SDK, set `ANDROID_HOME` (on macOS it is usually `~/Library/Android/sdk`). The project has no release signing config yet, so a Play Store build needs a keystore added to `android/app/build.gradle`.

## Tests and lint

```bash
npm test -- --watch=false --browsers=ChromeHeadless
npm run lint
```

If Karma can't find Chrome, point `CHROME_BIN` at your Chrome binary.

## CSV format for the Call Dialer

The first row is the header. The app reads the column named `phone` (any case) and ignores the others.

```csv
name,phone
Aisha,0123456789
Ben,0198765432
```

Values are split on commas, so quoted values that contain a comma aren't supported. An empty template ships at `src/assets/phone_numbers_template.csv`.

## Project layout

| Path | Contents |
|------|----------|
| `src/app/home/` | Home screen with the channel list and the dark-mode switch |
| `src/app/whatsapp/` | WhatsApp form, country picker and recent chats. `country-codes.ts` holds the dial-code table and the phone-number helpers. |
| `src/app/call-dialer/` | CSV import and sequential dialing |
| `src/app/telegram/`, `src/app/wechat/` | Screens not yet linked from Home |
| `src/app/theme.service.ts` | Light and dark mode, saved in `localStorage` under `theme` |
| `src/theme/variables.scss` | App tokens: `--app-bg`, `--app-border`, `--app-radius` |
| `src/global.scss` | Shared layout classes (`.page`, `.card`, `.section-header`) and the `.theme-whatsapp` colours |
| `android/` | Native Android project managed by Capacitor |

## Theming

Colours come from Ionic 9's default palette. Dark mode uses Ionic's class-based palette: `ThemeService` adds `ion-palette-dark` to `<html>`. Write dark-mode styles against `.ion-palette-dark`, or `:host-context(.ion-palette-dark)` inside a component stylesheet. A `prefers-color-scheme` media query ignores the in-app switch.

The WhatsApp screen and its country picker use WhatsApp green through the `.theme-whatsapp` class. The picker needs the class on its `ion-modal` because Ionic renders modals outside the page element.

## Data kept on the device

The app has no backend. It stores:

| Data | Where | Key |
|------|-------|-----|
| WhatsApp recent chats (last 20 numbers) | Ionic Storage (IndexedDB) | `messageHistory` |
| Imported CSV file and its name | `localStorage` | `uploadedFile`, `uploadedFileName` |
| Call history | `localStorage` | `callHistory` |
| Light or dark mode choice | `localStorage` | `theme` |

Clearing the app's data in Android settings removes all of it.

## Known limitations

- A local number loses one leading 0 before the country code is added, so `012…` becomes `6012…`. A few countries keep that 0 in international format (Italian landlines, for example). Paste the full `+` number for those.
- The automatic dialer's call detection (a 30-second timeout, and moving on when the call screen closes) is unreliable inside the Android WebView. Stop works, and tapping a single number to call it always works.
- Download CSV template may do nothing in the Android app, because the WebView ignores browser downloads.
- Country flags come from the phone's emoji font. Where flags aren't available, such as browsers on Windows, two letters show instead.

## Releasing

Update the version in three places:

- `package.json`: run `npm version <x.y.z> --no-git-tag-version`
- `android/app/build.gradle`: set `versionName` and increase `versionCode` by 1
- `src/app/home/home.page.ts`: set `version`, which Home displays

Then commit, tag with `git tag -a vX.Y.Z -m "ChatConnect X.Y.Z"`, and push the tag.
