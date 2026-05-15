# Handoff: eerste (volgende) release naar **npm** — stap voor stap

Voor wie: jij regelt **npm**-rechten + **GitHub**-secret; de code in deze repo is al ingesteld op **registry.npmjs.org** en `publishConfig.access: public`.

Meer detail: [release-flow.md](../release-flow.md) · workflow: [.github/workflows/publish.yml](../../.github/workflows/publish.yml)

---

## Wat je nodig hebt (voor je start)

| #   | Vereiste                                                                                                                                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **npm:** account met **publish** op scope **`@tmi-packages`** (org-lid / token mag publiceren). GitHub-lidmaatschap alleen is niet genoeg.                  |
| 2   | **GitHub:** rechten om **Actions secrets** te beheren op repo `TMI-apps/tmi-ui` (of org-secret die deze repo mag gebruiken).                                |
| 3   | Op `main`: migratie-code + **changeset** gemerged (anders geen nette version bump / publish).                                                               |
| 4   | **GitHub:** secret `TAG_PUSH_TOKEN` (PAT met `repo`) toegevoegd — anders start **Publish** niet automatisch na een tag (GitHub-beperking). Zie **Deel B2**. |

---

## Deel B2 — GitHub: `TAG_PUSH_TOKEN` (Publish na tag automatisch)

**Probleem:** De **Version packages**-workflow pusht de `v…`-tag met de standaard **`GITHUB_TOKEN`**. GitHub start daardoor **geen tweede workflow** — dus **Publish** draait niet, terwijl de tag wél bestaat.

**Oplossing:** Maak een **[classic PAT](https://github.com/settings/tokens)** met scope **`repo`** (of fine-grained: **Contents: Read and write** op `TMI-apps/tmi-ui`). Zet die als repository secret **`TAG_PUSH_TOKEN`**. De workflow gebruikt hem **alleen** voor `git push` van de tag, zodat **Publish** wél wordt getriggerd.

**Tot `TAG_PUSH_TOKEN` staat:** na elke release **Actions → Publish → Run workflow** handmatig (of tijdelijk tag opnieuw pushen met een PAT vanaf je machine — lastiger).

---

## Deel A — npm: token maken (aanbevolen pad voor CI)

**Waarvoor:** alleen **GitHub Actions** heeft dit token nodig om `pnpm publish` te mogen draaien.  
**Niet nodig** voor collega’s die alleen `pnpm add @tmi-packages/ui` in een app doen — zij gebruiken het **public** pakket zonder login.

### Stap 1 — Inloggen

1. Ga naar [npmjs.com](https://www.npmjs.com/) en log in met een account dat bij de org / scope **`@tmi-packages`** **mag publiceren** (rollen staan in npm, niet in GitHub).

### Stap 2 — Access Tokens openen

2. Open **Access Tokens**:
   - Vaak: klik op je **avatar** → **Access Tokens**, óf
   - Als jullie een **npm Organization** gebruiken: ga naar de **org** op npm → instellingen waar tokens voor de org worden beheerd (npm wijzigt de exacte menu’s soms; zoek op “token” of “access token”).

### Stap 3 — Nieuw token: welk type / welke rechten?

npm verandert namen geregeld, maar je zoekt steeds hetzelfde: een token dat **mag publiceren** naar packages onder **`@tmi-packages`**, liefst zo beperkt mogelijk.

- **Granular access token** (granulair): je kiest **welke pakketten of scopes** het token mag aanpakken. Dat is meestal het **beste**: geef alleen **Publish** voor **`@tmi-packages/ui`** (of voor de hele **`@tmi-packages` scope** als de UI dat zo aanbiedt en jullie dat beleid zo willen).
- **Classic** token: oudere stijl; als npm die nog toont, kies minimaal rechten die **publiceren** op jullie scope toestaan (vaak iets met **publish** of **write** — lees de npm-uitleg naast de checkboxen).
- **Automation token**: bedoeld voor **machines/CI**; prima als npm die aanbiedt en je daar expliciet **publish** voor jullie package/scope kunt geven.

**Wat de zin “granular of automation” bedoelde:** het zijn **twee verschillende producten/tokens** op npm. Je hoeft niet beide — maak **één** token. Kies in de UI degene waar je **publish** voor `@tmi-packages/ui` (of `@tmi-packages` scope) kunt aanzetten. Zie je alleen “granular”, neem die. Zie je alleen “automation” met juiste publish-rechten, mag die ook.

Als je vastloopt: kijk in de npm-tokenwizard **welke vinkjes** staan bij dit pakket of deze org — alles wat “read only” is, is **onvoldoende** om te releasen.

### Stap 4 — Token kopiëren (let op: één keer zichtbaar)

4. Na het aanmaken toont npm het token **één keer** als een lange geheime string (zoals een wachtwoord).

- **Kopieer** die string direct en plak hem **meteen** in GitHub als secret `NPM_TOKEN` (**Deel B**).  
  Daarna kun je hem in npm **niet meer terugzien** — alleen nog **verwijderen** en een **nieuw** token maken.
- **Niet** in Slack, mail of in de repo plakken; alleen in **GitHub Secrets** (of een password manager ter overdracht naar de persoon die het secret invult).

### Liever geen vast token in GitHub? → Deel F (OIDC)

**NPM_TOKEN** is een **lang geheim** dat in GitHub blijft staan tot je het roteert. Dat is normaal en werkt overal hetzelfde.

**Trusted Publishing (OIDC)** is het alternatief: je koppelt GitHub Actions **via npm’s website** aan dit repository. Dan vraagt GitHub bij elke publish-run een **kort geldig** token aan npm — **geen** lang `NPM_TOKEN`-geheim, maar **wel** correcte setup op npm + soms lastiger te debuggen.

**Praktijk:** als OIDC nieuw voor je is, begin met **Deel A + B**. Als dat werkt, ben je klaar. Wil je daarna overstappen op OIDC, volg **Deel F**. Blijft OIDC moeilijk: **NPM_TOKEN** is gewoon oké.

---

## Deel B — GitHub: secret zetten

1. Open GitHub → **`TMI-apps/tmi-ui`** → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**
   - Name: exact `NPM_TOKEN` (hoofdletters zoals in de workflow).
   - Value: de token uit **Deel A** (plak de volledige string die npm één keer toonde).
3. Save.

Sla deze stap **over** alleen als je **Deel F (OIDC)** al volledig werkend hebt en een **Publish**-run zonder secret geslaagd is. Twijfel je → zet het secret.

Als jullie **org-level** secrets gebruiken: zet dezelfde naam daar en geef deze repo toegang, of gebruik een org workflow policy die toestaat dat `secrets.NPM_TOKEN` beschikbaar is voor deze workflow.

---

## Deel C — Eerste succesvolle publish via CI (normale volgorde)

Doe dit in **deze volgorde**:

1. **Zorg dat `main` goed staat** — migratie naar npm + changeset gemerged (check met je team).
2. **Wacht op een versie-commit op `main`**  
   Er moet een wijziging zijn die door Changesets wordt opgepakt; na merge draait **Version packages** (workflow op `main`).
3. Open **Actions** in de repo:
   - **Version packages** moet **groen** zijn.  
     Die workflow: past `package.json` / changelog toe → **pusht tag** `vX.Y.Z` (als er echt een bump was).
   - Daarna start automatisch **Publish** (door de tag `v*`).
4. **Publish** moet **groen** zijn.
   - Faalt het op auth: controleer `NPM_TOKEN` en npm-rechten.
   - Faalt **Version packages** vaak door **branch protection** (bot mag niet pushen): los dat op in repo-instellingen — zie [release-flow.md](../release-flow.md).

---

## Deel D — Controleren dat het op npm staat

1. Open [https://www.npmjs.com/package/@tmi-packages/ui](https://www.npmjs.com/package/@tmi-packages/ui).
2. Check: de **nieuwe versie** staat erbij en het pakket is **public**.
3. (Optioneel) Lege map, `pnpm init -y`, daarna `pnpm add @tmi-packages/ui@<versie>` — moet werken **zonder** `.npmrc` naar GitHub Packages.

Pas **daarna** intern zeggen: “we consumeren van npm.”

---

## Deel E — Andere app-repo’s (niet tmi-ui)

Voor elke app die `@tmi-packages/ui` eerst via **GitHub Packages** installeerde:

1. Verwijder eventueel deze **legacy** regel uit `.npmrc` (oude GitHub Packages-mapping): `@tmi-apps:registry=https://npm.pkg.github.com` — alleen als niets anders die nog nodig heeft.
2. Verwijder `GH_PACKAGES_READ_TOKEN` uit CI als die alleen voor dit pakket was.
3. `pnpm install` → lockfile commit → build/test.

Stap-voor-stap tekst: [consumer-setup.md § Migrating from GitHub Packages](../consumer-setup.md#migrating-from-github-packages).

---

## Deel F — Alternatief: Trusted Publishing (OIDC), zonder vast `NPM_TOKEN`

Als je **geen** lang NPM-token in GitHub wilt:

1. Op **npm**: koppel **Trusted Publisher** aan repo **`TMI-apps/tmi-ui`** volgens [npm: Trusted publishers](https://docs.npmjs.com/trusted-publishers).
2. In deze repo heeft de **Publish**-workflow al `id-token: write` (nodig voor OIDC).
3. Draai **Publish** opnieuw (na een tag of `workflow_dispatch`).

- Werkt publiceren **zonder** dat `NPM_TOKEN` in GitHub staat? Dan mag dat secret leeg blijven voor die aanpak (zo lang npm en GitHub zo zijn ingesteld).
- **Nog steeds fout?** Vul **Deel A + B** alsnog in — token + secret is het meest betrouwbare pad en het makkelijkst te debuggen.

---

## Deel G — Optioneel: eerste maal handmatig vanaf je laptop

Alleen als CI steeds blijft falen en je **snel** het pakket op npm wilt **claimen**:

1. `npm login` (account met publish op `@tmi-packages`).
2. In deze repo na `pnpm install` en `pnpm run build`:  
   `npm publish --access public`  
   (in deze repo staat `publishConfig` al goed — flag is dan vooral extra duidelijk.)
3. Daarna CI voor **volgende** releases alsnog goed configureren (token of OIDC).

---

## Snel: wat is fout?

| Symptoom                         | Meest waarschijnlijk                                                                                                                                            |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tag op GitHub, nooit Publish-run | `TAG_PUSH_TOKEN` mist: tag ging met `GITHUB_TOKEN` → **Publish** triggert niet. Zet `TAG_PUSH_TOKEN` of start **Publish** handmatig.                            |
| 402 / 403 bij publish            | Geen publish-recht op `@tmi-packages`, of package niet public.                                                                                                  |
| Auth error in Actions            | `NPM_TOKEN` ontbreekt, verkeerde secret-naam, of token verlopen.                                                                                                |
| Version packages faalt           | Branch protection / bot mag niet naar `main` pushen.                                                                                                            |
| Tag maar geen Publish            | Actions uitgeschakeld, of kijk of **Publish** run voor die tag handmatig opnieuw starten (`workflow_dispatch` of tag opnieuw — voorzichtig met dubbele semver). |
