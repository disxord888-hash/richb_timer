/**
 * Richb暦 Timer & Alarm - Main Logic
 */

// ----------------------------------------------------
// Constants & Config
// ----------------------------------------------------
const UNITS = {
    p: { val: 1.245 / 12, label: 'p' },
    L: { val: 1.245, label: 'L' },
    o: { val: 50 * 1.245, label: 'o' },
    I: { val: 50 * 50 * 1.245, label: 'Ī' },
    U: { val: 75000 * 1.245, label: 'U' }, // 30 I
    'é': { val: 6 * 75000 * 1.245, label: 'é' }, // 6 U
    Y: { val: 285 * 75000 * 1.245, label: 'Y' } // 285 U
};

const DEFAULT_COLOR_PRESETS = [
    { name: 'Navy', rgb: { btn: { r: 0, g: 0, b: 5 }, bg: { r: 0, g: 0, b: 1 }, main: { r: 0, g: 0, b: 3 }, text: { r: 0, g: 0, b: 8 }, dim: { r: 0, g: 0, b: 4 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Dark red', rgb: { btn: { r: 5, g: 0, b: 0 }, bg: { r: 1, g: 0, b: 0 }, main: { r: 3, g: 0, b: 0 }, text: { r: 8, g: 0, b: 0 }, dim: { r: 4, g: 0, b: 0 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'digital style', rgb: { btn: { r: 0, g: 5, b: 0 }, bg: { r: 0, g: 0, b: 0 }, main: { r: 0, g: 3, b: 0 }, text: { r: 0, g: 8, b: 0 }, dim: { r: 0, g: 4, b: 0 }, btntxt: { r: 0, g: 0, b: 0 } } },
    { name: 'monochrome', rgb: { btn: { r: 4, g: 4, b: 4 }, bg: { r: 7, g: 7, b: 7 }, main: { r: 3, g: 3, b: 3 }, text: { r: 1, g: 1, b: 1 }, dim: { r: 4, g: 4, b: 4 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Midnight', rgb: { btn: { r: 1, g: 1, b: 2 }, bg: { r: 0, g: 0, b: 0 }, main: { r: 2, g: 2, b: 4 }, text: { r: 6, g: 6, b: 8 }, dim: { r: 3, g: 3, b: 4 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Forest', rgb: { btn: { r: 1, g: 3, b: 1 }, bg: { r: 0, g: 1, b: 0 }, main: { r: 2, g: 4, b: 2 }, text: { r: 6, g: 8, b: 6 }, dim: { r: 3, g: 4, b: 3 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Sunset', rgb: { btn: { r: 5, g: 2, b: 0 }, bg: { r: 2, g: 0, b: 0 }, main: { r: 8, g: 4, b: 0 }, text: { r: 8, g: 8, b: 4 }, dim: { r: 5, g: 4, b: 2 }, btntxt: { r: 1, g: 1, b: 0 } } },
    { name: 'Lavender', rgb: { btn: { r: 4, g: 2, b: 5 }, bg: { r: 1, g: 0, b: 1 }, main: { r: 6, g: 4, b: 8 }, text: { r: 8, g: 8, b: 8 }, dim: { r: 5, g: 5, b: 5 }, btntxt: { r: 1, g: 0, b: 1 } } },
    { name: 'Ocean', rgb: { btn: { r: 0, g: 3, b: 5 }, bg: { r: 0, g: 1, b: 2 }, main: { r: 2, g: 6, b: 8 }, text: { r: 6, g: 8, b: 8 }, dim: { r: 3, g: 4, b: 4 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Gold', rgb: { btn: { r: 5, g: 4, b: 0 }, bg: { r: 1, g: 1, b: 0 }, main: { r: 8, g: 7, b: 0 }, text: { r: 8, g: 8, b: 0 }, dim: { r: 5, g: 5, b: 0 }, btntxt: { r: 1, g: 1, b: 0 } } },
    { name: 'Sakura', rgb: { btn: { r: 8, g: 4, b: 5 }, bg: { r: 8, g: 7, b: 7 }, main: { r: 8, g: 5, b: 6 }, text: { r: 1, g: 0, b: 0 }, dim: { r: 3, g: 2, b: 2 }, btntxt: { r: 1, g: 1, b: 2 } } },
    { name: 'Sky', rgb: { btn: { r: 4, g: 6, b: 8 }, bg: { r: 7, g: 8, b: 8 }, main: { r: 5, g: 7, b: 8 }, text: { r: 0, g: 1, b: 2 }, dim: { r: 2, g: 3, b: 4 }, btntxt: { r: 0, g: 1, b: 2 } } },
    { name: 'Mint', rgb: { btn: { r: 1, g: 6, b: 3 }, bg: { r: 7, g: 8, b: 7 }, main: { r: 3, g: 7, b: 5 }, text: { r: 0, g: 1, b: 0 }, dim: { r: 2, g: 3, b: 2 }, btntxt: { r: 0, g: 1, b: 0 } } },
    { name: 'Earth', rgb: { btn: { r: 3, g: 2, b: 1 }, bg: { r: 1, g: 1, b: 0 }, main: { r: 4, g: 3, b: 2 }, text: { r: 8, g: 7, b: 6 }, dim: { r: 4, g: 3, b: 1 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Dusk', rgb: { btn: { r: 2, g: 1, b: 3 }, bg: { r: 0, g: 0, b: 1 }, main: { r: 3, g: 2, b: 5 }, text: { r: 7, g: 6, b: 8 }, dim: { r: 4, g: 3, b: 5 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Neon', rgb: { btn: { r: 0, g: 8, b: 2 }, bg: { r: 0, g: 0, b: 0 }, main: { r: 0, g: 8, b: 4 }, text: { r: 8, g: 8, b: 8 }, dim: { r: 0, g: 5, b: 2 }, btntxt: { r: 0, g: 0, b: 0 } } },
    { name: 'Neon Red', rgb: { btn: { r: 8, g: 0, b: 0 }, bg: { r: 0, g: 0, b: 0 }, main: { r: 8, g: 0, b: 2 }, text: { r: 8, g: 0, b: 0 }, dim: { r: 5, g: 0, b: 0 }, btntxt: { r: 0, g: 0, b: 0 } } },
    { name: 'Berry', rgb: { btn: { r: 6, g: 1, b: 3 }, bg: { r: 1, g: 0, b: 1 }, main: { r: 8, g: 2, b: 4 }, text: { r: 8, g: 8, b: 8 }, dim: { r: 5, g: 2, b: 3 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Sand', rgb: { btn: { r: 6, g: 5, b: 3 }, bg: { r: 8, g: 8, b: 7 }, main: { r: 7, g: 6, b: 4 }, text: { r: 1, g: 1, b: 0 }, dim: { r: 3, g: 3, b: 2 }, btntxt: { r: 1, g: 1, b: 1 } } },
    { name: 'Coal', rgb: { btn: { r: 1, g: 1, b: 1 }, bg: { r: 0, g: 0, b: 0 }, main: { r: 2, g: 2, b: 2 }, text: { r: 8, g: 8, b: 8 }, dim: { r: 4, g: 4, b: 4 }, btntxt: { r: 8, g: 8, b: 8 } } },
    { name: 'Rose', rgb: { btn: { r: 8, g: 3, b: 4 }, bg: { r: 3, g: 1, b: 1 }, main: { r: 8, g: 5, b: 6 }, text: { r: 8, g: 8, b: 8 }, dim: { r: 5, g: 2, b: 2 }, btntxt: { r: 8, g: 8, b: 8 } } }
];

const TRANSLATIONS = {
    ja: {
        lang_toggle: "言語切替",
        mode_normal: "通常モード",
        mode_view_only: "表示のみ",
        quick_input: "クイック入力",
        converter: "変換",
        theme: "テーマ",
        settings: "設定",
        backup: "バックアップ/復元",
        help: "ヘルプ",
        btn_support: "サポート",
        base_point: "起点 (0.0L)",
        save_btn: "💾 保存",
        save_current: "現在の設定を保存",
        unit_yr: "年",
        unit_mo: "月",
        unit_dy: "日",
        unit_hr: "時",
        unit_mn: "分",
        unit_sc: "秒",
        unit_s: "秒",
        reset_to_now: "↺ 現在時刻にリセット",
        alarm_title: "アラーム (指定時刻)",
        alarm_placeholder: "例: 500L, 10o, 1h 30m",
        set_alarm_btn: "🔔 アラーム設定",
        quick_input_label: "クイック入力",
        timer_title: "タイマー (カウントダウン)",
        timer_placeholder: "例: 10m, 500L",
        start_timer_btn: "▶ タイマー開始",
        reset_timer_btn: "🔄 タイマーリセット",
        timer_presets: "タイマー履歴/プリセット",
        time_is_up: "時間です！",
        stop_alarm_btn: "アラーム停止",
        help_title: "Richb 単位",
        tab_units: "単位一覧",
        tab_calendar: "暦の仕組み",
        tab_support: "サポート",
        converter_title: "単位変換",
        quick_input_title: "クイック入力",
        quick_input_desc: "タップして記号をコピー",
        presets_label: "プリセット:",
        export_btn: "📤 エクスポート",
        import_btn: "📥 復元",
        confirm_ok: "よろしいですか？",
        confirm_reset_now: "起点時刻を現在にリセットしますか？",
        confirm_delete: "このプリセットを削除しますか？",
        confirm_restore: "すべての設定が上書きされ、アプリが再読み込みされます。続行しますか？ ⚠️",
        restore_success: "設定が復元されました！再読み込みします... 🚀",
        timer_presets_prompt: "タイマーのラベルを入力してください (例: 仕事、休憩):",
        alert_invalid_format: "入力形式が正しくありません。 (例: 500L, 10o, 1Yr, 5m, 1h, 1d など)",
        elapsed_label: "経過時間: ",
        copied_alert: "コピーしました: ",
        theme_title: "テーマ選択",
        theme_default: "標準",
        theme_purple: "パープル",
        theme_orange: "オレンジ",
        theme_green: "グリーン",
        theme_mono: "モノクロ",
        custom_rgb_title: "カスタムRGB (0-8)",
        label_btn_color: "ボタン:",
        label_bg_color: "背景:",
        label_main_color: "メイン (アクセント):",
        label_text_color: "テキスト色:",
        label_dim_color: "暗いテキスト/ラベル:",
        label_btntxt_color: "ボタン内文字:",
        btn_apply_custom: "✅ カスタム設定を適用",
        settings_title: "⚙️ 設定",
        tab_color: "カラー",
        rgb255_title: "RGB (0-255) 数値指定",
        rgb255_desc: "各色のRGB値 (0-255) を入力してください。",
        btn_apply_rgb255: "✅ RGBカラーを適用",
        tab_font: "フォント",
        font_title: "フォント選択",
        font_desc: "アプリ全体のフォントを選択してください（バージョン表示を除く）。",
        backup_title: "💾 バックアップと復元",
        backup_desc: "設定をテキスト形式で書き出したり、貼り付けて復元したりできます。",
        backup_placeholder: "ここに設定のJSONを貼り付けてください...",
        prompt_preset_name: "プリセットの名前を入力してください:",
        prompt_timer_label: "タイマーのラベルを入力してください (例: 仕事、休憩):",
        prompt_base_label: "この起点のラベルを入力してください:",
        alert_config_custom: "最初にカスタムテーマを設定してください！",
        alert_enter_timer: "最初にタイマー値を入力してください (例: 500L)！",
        alert_exported: "設定を書き出し、クリップボードにコピーしました！ 📄✅",
        alert_exported_no_copy: "設定を書き出しました！枠内のテキストをコピーしてください。 📄",
        alert_import_empty: "設定を復元するにはバックアップデータを貼り付けてください！ 📥",
        confirm_apply_theme: "テーマ \"{name}\" を適用しますか？",
        confirm_delete_color: "このカラープリセットを削除しますか？",
        confirm_delete_timer: "このタイマーセットを削除しますか？",
        unit_h_real: "時間",
        unit_d_real: "日",
        btn_notice: "お知らせ",
        tab_notice: "お知らせ",
        btn_changelog: "📜 更新履歴",
        tab_changelog: "更新履歴",
        help_update_desc: "更新は１日に３～４回もしているので、１日に１回は、サイトのデータを消してください。",
        help_desc: "100BPMの鼓動(1.2秒/拍、補正値1.245秒)に基づいたリズム感のある暦体系です。",
        help_p_desc: "サブビート (1/12 L)",
        help_l_desc: "基本拍 (鼓動)",
        help_o_desc: "50 L (一瞬 / モーメント)",
        help_i_desc: "50 o (一区切り / セッション)",
        help_u_desc: "30 Ī (一周期 / 日)",
        help_e_desc: "6 U (一週間)",
        help_y_desc: "285 U (一年)",
        preset_navy: "ネイビー",
        preset_dark_red: "ダークレッド",
        preset_digital_style: "デジタルスタイル",
        preset_monochrome: "モノクロ",
        preset_midnight: "ミッドナイト",
        preset_forest: "フォレスト",
        preset_sunset: "サンセット",
        preset_lavender: "ラベンダー",
        preset_ocean: "オーシャン",
        preset_gold: "ゴールド",
        preset_sakura: "サクラ",
        preset_sky: "スカイ",
        preset_mint: "ミント",
        preset_earth: "アース",
        preset_dusk: "ダスク",
        preset_neon: "ネオン",
        preset_neon_red: "ネオンレッド",
        preset_berry: "ベリー",
        preset_sand: "サンド",
        preset_coal: "コール",
        preset_rose: "ローズ"
    },
    en: {
        lang_toggle: "Switch Language",
        mode_normal: "Normal Mode",
        mode_view_only: "View Only",
        quick_input: "Quick Input",
        converter: "Converter",
        theme: "Theme",
        settings: "Settings",
        backup: "Backup/Restore",
        help: "Help",
        btn_support: "Support",
        base_point: "Base Point (0.0L)",
        save_btn: "💾 SAVE",
        save_current: "Save Current",
        unit_yr: "Year",
        unit_mo: "Mo",
        unit_dy: "Day",
        unit_hr: "Hr",
        unit_mn: "Min",
        unit_sc: "Sec",
        unit_s: "s",
        reset_to_now: "↺ RESET TO NOW",
        alarm_title: "Alarm (Time)",
        alarm_placeholder: "e.g. 500L, 10o, 1h 30m",
        set_alarm_btn: "🔔 Set Alarm",
        quick_input_label: "QUICK INPUT",
        timer_title: "Timer (Countdown)",
        timer_placeholder: "e.g. 10m, 500L",
        start_timer_btn: "▶ Start Timer",
        reset_timer_btn: "🔄 RESET TIMER",
        timer_presets: "Timer Presets",
        time_is_up: "TIME IS UP",
        stop_alarm_btn: "STOP ALARM",
        help_title: "Richb Units",
        tab_units: "Units",
        tab_calendar: "Calendar",
        tab_support: "Support",
        converter_title: "Unit Converter",
        quick_input_title: "Quick Input",
        quick_input_desc: "Tap to copy symbol.",
        presets_label: "Presets:",
        export_btn: "📤 EXPORT",
        import_btn: "📥 RESTORE",
        confirm_ok: "Is this okay?",
        confirm_reset_now: "Reset base time to NOW?",
        confirm_delete: "Delete this preset?",
        confirm_restore: "This will OVERWRITE all current settings and reload the app. Continue? ⚠️",
        restore_success: "Settings restored successfully! Reloading... 🚀",
        timer_presets_prompt: "Enter timer label (e.g. \"Work\", \"Rest\"):",
        alert_invalid_format: "Invalid format. Use 500L, 10o, 1Yr, 5m, 1h, 1d etc.",
        elapsed_label: "Elapsed: ",
        copied_alert: "Copied: ",
        theme_title: "Select Theme",
        theme_default: "Default",
        theme_purple: "Purple",
        theme_orange: "Orange",
        theme_green: "Green",
        theme_mono: "Mono",
        custom_rgb_title: "Custom RGB (0-8)",
        label_btn_color: "Button:",
        label_bg_color: "Background:",
        label_main_color: "Main (Acnt):",
        label_text_color: "Text Color:",
        label_dim_color: "Dim/Label:",
        label_btntxt_color: "Btn Text:",
        btn_apply_custom: "✅ APPLY CUSTOM",
        settings_title: "⚙️ Settings",
        tab_color: "Color",
        rgb255_title: "RGB (0-255) Color Input",
        rgb255_desc: "Enter RGB values (0-255) for each color.",
        btn_apply_rgb255: "✅ Apply RGB Colors",
        tab_font: "Font",
        font_title: "Select Font",
        font_desc: "Choose a font for the application (Except version info).",
        backup_title: "💾 Backup & Restore",
        backup_desc: "Export your settings to a text string, or paste one here and click restore to apply.",
        backup_placeholder: "Paste settings JSON here...",
        prompt_preset_name: "Enter preset name:",
        prompt_timer_label: "Enter timer label (e.g. \"Work\", \"Rest\"):",
        prompt_base_label: "Enter preset label for this Base Point:",
        alert_config_custom: "Configure a custom theme first!",
        alert_enter_timer: "Enter a timer value first (e.g. 500L)!",
        alert_exported: "Settings exported and copied to clipboard! 📄✅",
        alert_exported_no_copy: "Settings exported! Please copy the text in the box. 📄",
        alert_import_empty: "Please paste the backup data first! 📥",
        confirm_apply_theme: "Apply theme \"{name}\"? ",
        confirm_delete_color: "Delete this color preset?",
        confirm_delete_timer: "Delete this timer preset?",
        unit_h_real: "hr",
        unit_d_real: "days",
        btn_notice: "Notice",
        tab_notice: "Notice",
        btn_changelog: "📜 Changelog",
        tab_changelog: "Changelog",
        help_update_desc: "The site is updated 3-4 times a day. Please clear your site data once a day to ensure you have the latest version.",
        help_desc: "A rhythmic calendar system based on the 100BPM heartbeat (1.2 sec/beat, corrected to 1.245s).",
        help_p_desc: "Sub-beat (1/12 L)",
        help_l_desc: "Base Beat (Heartbeat)",
        help_o_desc: "50 L (A \"Moment\")",
        help_i_desc: "50 o (A \"Session\")",
        help_u_desc: "30 Ī (A \"Cycle/Day\")",
        help_e_desc: "6 U (A \"Week\")",
        help_y_desc: "285 U (A \"Year\")",
        preset_navy: "Navy",
        preset_dark_red: "Dark red",
        preset_digital_style: "digital style",
        preset_monochrome: "monochrome",
        preset_midnight: "Midnight",
        preset_forest: "Forest",
        preset_sunset: "Sunset",
        preset_lavender: "Lavender",
        preset_ocean: "Ocean",
        preset_gold: "Gold",
        preset_sakura: "Sakura",
        preset_sky: "Sky",
        preset_mint: "Mint",
        preset_earth: "Earth",
        preset_dusk: "Dusk",
        preset_neon: "Neon",
        preset_neon_red: "Neon Red",
        preset_berry: "Berry",
        preset_sand: "Sand",
        preset_coal: "Coal",
        preset_rose: "Rose"
    }
};

// ----------------------------------------------------
// Core Logic: RichbTime Class
// ----------------------------------------------------
class RichbTime {
    constructor(seconds) {
        this.totalSeconds = Math.max(0, seconds);
    }

    // Convert seconds to Richb Units
    toRichbString() {
        const Y_val = 285 * 75000 * 1.245;
        // if (this.totalSeconds >= Y_val * 100) ... handle crazy large numbers?
        // Let's just allow it for now logic-wise.

        // Calculate L (base unit)
        // 1L = 1.245s
        let totalL = this.totalSeconds / 1.245;

        // Calculate total U (for display in parentheses)
        const totalU = Math.floor(totalL / 75000);

        // Y calculation (1Y = 285U = 285 * 75000 L)
        const y = Math.floor(totalL / (285 * 75000));
        let remL = totalL % (285 * 75000);

        // é calculation (1é = 6U = 450000 L)
        // Note: 1Y = 285U, 1é = 6U. 285/6 = 47.5. So 1Y = 47.5é.
        // The hierarchy we use is Y -> é -> U -> I ...
        const e_unit = Math.floor(remL / (6 * 75000));
        remL = remL % (6 * 75000);

        // U calculation (1U = 75000L)
        const u = Math.floor(remL / 75000);
        remL = remL % 75000;

        // I calculation (1I = 2500L)
        const i = Math.floor(remL / 2500);
        remL = remL % 2500;

        // o calculation (1o = 50L)
        const o = Math.floor(remL / 50);
        remL = remL % 50;

        // L calculation
        const l = Math.floor(remL);
        const fracL = remL - l; // Remaining fraction of L for p

        // p calculation (1L = 12p)
        // p = fracL * 12
        const p = Math.floor(fracL * 12);

        // Display - First line: Y, é, U (totalU)
        let firstLine = [];
        if (y > 0) firstLine.push(`<span class="val">${y}</span><span class="unit-label">Y</span>`);
        if (e_unit > 0 || y > 0) firstLine.push(`<span class="val">${e_unit}</span><span class="unit-label">é</span>`);
        if (u > 0 || e_unit > 0 || y > 0) {
            firstLine.push(`<span class="val">${u}</span><span class="unit-label">U</span>`);
            firstLine.push(`<span class="total-u">(${totalU}U)</span>`);
        }

        // Second line: Ī, o, L, p
        let secondLine = [];
        if (i > 0 || u > 0 || e_unit > 0 || y > 0) secondLine.push(`<span class="val">${i}</span><span class="unit-label">Ī</span>`);
        if (o > 0 || i > 0 || u > 0 || e_unit > 0 || y > 0) secondLine.push(`<span class="val">${o}</span><span class="unit-label">o</span>`);
        if (l > 0 || p > 0 || (firstLine.length === 0 && secondLine.length === 0)) {
            // Always show L if others are empty, or if L>0
            secondLine.push(`<span class="val">${l}</span><span class="unit-label">L</span>`);
        }

        // Show p if > 0
        if (p > 0) secondLine.push(`<span class="val">${p}</span><span class="unit-label">p</span>`);

        // Combine with line break if first line has content
        if (firstLine.length > 0) {
            return firstLine.join('') + '<br>' + secondLine.join('');
        }
        return secondLine.join('');
    }
}

// ----------------------------------------------------
// Sound Manager (Oscillator)
// ----------------------------------------------------
class SoundManager {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.oscillator = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    startAlarm() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;

        this.playTone();
        this.interval = setInterval(() => this.playTone(), 1000);
    }

    playTone() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    stopAlarm() {
        if (this.interval) clearInterval(this.interval);
        this.isPlaying = false;
    }
}

// ----------------------------------------------------
// App State & Logic
// ----------------------------------------------------
const App = {
    rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('').toUpperCase();
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    // --- Tab Switching Logic ---
    initSettingsTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        const contents = document.querySelectorAll('#settings-modal .tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(c => {
                    if (c.id === target) c.classList.add('active');
                    else c.classList.remove('active');
                });
            });
        });
    },

    setFont(font) {
        this.selectedFont = font;
        document.documentElement.style.setProperty('--font-app', font === 'inherit' ? 'var(--font-ui)' : font);
        this.saveSettings();
    },

    // State
    baseTime: Date.now(),
    lastUpdate: 0,

    // Multiple Alarms (At specific time)
    activeAlarms: [], // {id, targetSec, triggered, label}

    // Multiple Timers (Countdown)
    activeTimers: [], // {id, endTime, durationSec, triggered, running, label, remainingOnPause}

    currentTheme: 'default', // default, purple, orange, green, monopoly
    language: 'ja',

    mode: 'normal', // normal, compact, view-only

    // Presets
    savedColorPresets: [],
    savedTimerPresets: [],
    savedBasePresets: [],

    // Components
    sound: new SoundManager(),

    // Elements
    el: {},

    t(key) {
        return (TRANSLATIONS[this.language] && TRANSLATIONS[this.language][key]) || key;
    },

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.innerHTML = this.t(key);
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });
        document.documentElement.lang = this.language;

        // Auto-refresh dynamic content on language change
        this.loadSupport();
        if (this.el.selectFont) this.el.selectFont.value = this.selectedFont || 'inherit';
    },

    copySymbol(char) {
        navigator.clipboard.writeText(char);
        alert(this.t('copied_alert') + char);
    },

    init() {
        // Cache DOM
        this.el.clockMain = document.getElementById('richb-main');
        this.el.clockReal = document.getElementById('real-time');
        this.el.clockElapsedReal = document.getElementById('elapsed-real-time');

        this.el.baseYr = document.getElementById('base-yr');
        this.el.baseMo = document.getElementById('base-mo');
        this.el.baseDy = document.getElementById('base-dy');
        this.el.baseHr = document.getElementById('base-hr');
        this.el.baseMn = document.getElementById('base-mn');
        this.el.baseSc = document.getElementById('base-sc');
        this.el.btnSetToday = document.getElementById('btn-set-today');

        this.el.alarmInput = document.getElementById('alarm-input');
        this.el.alarmToggle = document.getElementById('btn-toggle-alarm');
        this.el.btnSettings = document.getElementById('btn-settings');
        this.el.modalSettings = document.getElementById('settings-modal');
        this.el.btnCloseSettings = document.getElementById('btn-close-settings');
        this.el.btnApplyRgb255 = document.getElementById('btn-apply-rgb255');
        this.el.selectFont = document.getElementById('select-font');
        this.el.hexInputs = {
            btn: document.getElementById('hex-btn'),
            bg: document.getElementById('hex-bg'),
            main: document.getElementById('hex-main'),
            text: document.getElementById('hex-text'),
            dim: document.getElementById('hex-dim'),
            btntxt: document.getElementById('hex-btntxt')
        };

        // Timer Elements
        this.el.timerInput = document.getElementById('timer-input');
        this.el.timerStart = document.getElementById('btn-timer-start');
        this.el.timerReset = document.getElementById('btn-timer-reset');
        this.el.timerDisplay = document.getElementById('timer-display');

        // Overlay
        this.el.overlay = document.getElementById('alarm-overlay');
        this.el.btnStop = document.getElementById('btn-stop-alarm');

        this.el.appContainer = document.getElementById('app-container');

        // Add Alarm Status Text
        const alarmStatus = document.createElement('div');
        alarmStatus.id = 'alarm-status';
        alarmStatus.style.fontSize = '0.8rem';
        alarmStatus.style.marginTop = '5px';
        alarmStatus.style.color = 'var(--text-dim)';
        this.el.alarmToggle.parentNode.appendChild(alarmStatus);
        this.el.alarmStatus = alarmStatus;

        // Presets elements
        this.el.colorPresetsList = document.getElementById('color-presets-list');
        this.el.btnSaveColorPreset = document.getElementById('btn-save-color-preset');
        this.el.timerPresetsList = document.getElementById('timer-presets-list');
        this.el.btnSaveTimerPreset = document.getElementById('btn-save-timer-preset');
        this.el.basePresetsList = document.getElementById('base-presets-list');
        this.el.btnSaveBasePreset = document.getElementById('btn-save-base-preset');

        // Active Lists
        this.el.activeAlarmsList = document.getElementById('active-alarms-list');
        this.el.activeTimersList = document.getElementById('active-timers-list');

        // Unit Previews
        this.el.alarmUnitPreview = document.getElementById('alarm-unit-preview');
        this.el.timerUnitPreview = document.getElementById('timer-unit-preview');

        // Backup Elements
        this.el.btnBackup = document.getElementById('btn-backup');
        this.el.modalBackup = document.getElementById('backup-modal');
        this.el.btnCloseBackup = document.getElementById('btn-close-backup');
        this.el.backupData = document.getElementById('backup-data');
        this.el.btnExportSettings = document.getElementById('btn-export-settings');
        this.el.btnImportSettings = document.getElementById('btn-import-settings');

        // Notice Elements
        this.el.btnNotice = document.getElementById('btn-notice');
        this.el.modalNotice = document.getElementById('notice-modal');
        this.el.btnCloseNotice = document.getElementById('btn-close-notice');
        this.el.tickerContent = document.getElementById('ticker-content');
        this.el.noticeFullContent = document.getElementById('notice-full-content');

        // Support Elements
        this.el.btnSupport = document.getElementById('btn-support');
        this.el.modalSupport = document.getElementById('support-modal');
        this.el.btnCloseSupport = document.getElementById('btn-close-support');
        this.el.supportFullContent = document.getElementById('support-full-content');

        // Version/Changelog Elements
        this.el.btnVersion = document.getElementById('btn-version');
        this.el.modalVersion = document.getElementById('version-modal');
        this.el.btnCloseVersion = document.getElementById('btn-close-version');
        this.el.versionFullContent = document.getElementById('version-full-content');

        // Load stored
        this.loadSettings();

        // Language toggle
        this.el.btnLang = document.getElementById('btn-lang');
        if (this.el.btnLang) {
            this.el.btnLang.addEventListener('click', () => {
                this.language = this.language === 'ja' ? 'en' : 'ja';
                this.updateUI();
                this.saveSettings();
            });
        }
        this.updateUI();

        // Listeners: Base Time
        this.el.btnSetToday.addEventListener('click', () => {
            if (confirm(this.t('confirm_reset_now'))) {
                this.setBaseToNow();
                this.sound.init();
            }
        });

        const updateBaseFromUnits = () => {
            const yr = parseInt(this.el.baseYr.value) || 0;
            const mo = (parseInt(this.el.baseMo.value) || 1) - 1;
            const dy = parseInt(this.el.baseDy.value) || 1;
            const hr = parseInt(this.el.baseHr.value) || 0;
            const mn = parseInt(this.el.baseMn.value) || 0;
            const sc = parseInt(this.el.baseSc.value) || 0;
            const date = new Date(yr, mo, dy, hr, mn, sc);
            if (!isNaN(date.getTime())) {
                this.baseTime = date.getTime();
                this.saveSettings();
            }
        };

        [this.el.baseYr, this.el.baseMo, this.el.baseDy, this.el.baseHr, this.el.baseMn, this.el.baseSc].forEach(el => {
            el.addEventListener('change', updateBaseFromUnits);
            el.addEventListener('input', updateBaseFromUnits);
        });

        // Listeners: Alarm
        this.el.alarmToggle.addEventListener('click', () => {
            if (confirm(this.t('confirm_ok'))) {
                this.requestNotificationPermission();
                this.sound.init();
                this.setAlarm();
            }
        });

        // Listeners: Timer
        this.el.timerStart.addEventListener('click', () => {
            if (confirm(this.t('confirm_ok'))) {
                this.requestNotificationPermission(); // Request on interaction
                this.toggleTimer();
            }
        });
        this.el.timerReset.addEventListener('click', () => this.resetTimer());

        // Listeners: Overlay Stop
        this.el.btnStop.addEventListener('click', () => this.stopAllSound());

        // Listeners: Settings (Merged/Cleaned)
        if (this.el.btnSettings) this.el.btnSettings.addEventListener('click', () => this.el.modalSettings.classList.remove('hidden'));
        if (this.el.btnCloseSettings) this.el.btnCloseSettings.addEventListener('click', () => {
            this.el.modalSettings.classList.add('hidden');
            this.saveSettings();
        });
        if (this.el.btnApplyRgb255) this.el.btnApplyRgb255.addEventListener('click', () => this.applyRgb255Theme());
        this.el.modalSettings.addEventListener('click', (e) => {
            if (e.target === this.el.modalSettings) this.el.modalSettings.classList.add('hidden');
        });

        // HEX Input event listeners
        Object.keys(this.el.hexInputs).forEach(key => {
            const hexEl = this.el.hexInputs[key];
            if (hexEl) {
                hexEl.addEventListener('change', () => {
                    let hex = hexEl.value.trim();
                    if (hex && !hex.startsWith('#')) hex = '#' + hex;
                    const rgb = this.hexToRgb(hex);
                    if (rgb) {
                        const rIn = document.getElementById(`rgb255-${key}-r`);
                        const gIn = document.getElementById(`rgb255-${key}-g`);
                        const bIn = document.getElementById(`rgb255-${key}-b`);
                        if (rIn) rIn.value = rgb.r;
                        if (gIn) gIn.value = rgb.g;
                        if (bIn) bIn.value = rgb.b;
                    } else {
                        const current = this.customRGB ? this.customRGB[key] : null;
                        if (current) {
                            const rVal = current.isRaw ? current.r : Math.round((current.r / 8) * 255);
                            const gVal = current.isRaw ? current.g : Math.round((current.g / 8) * 255);
                            const bVal = current.isRaw ? current.b : Math.round((current.b / 8) * 255);
                            hexEl.value = this.rgbToHex(rVal, gVal, bVal);
                        }
                    }
                });
            }
        });

        // Font selection listener
        if (this.el.selectFont) {
            this.el.selectFont.addEventListener('change', (e) => {
                this.setFont(e.target.value);
            });
        }

        // Settings tab init
        this.initSettingsTabs();

        // Listeners: Support
        if (this.el.btnSupport) {
            this.el.btnSupport.addEventListener('click', () => {
                this.el.modalSupport.classList.remove('hidden');
            });
            this.el.btnCloseSupport.addEventListener('click', () => {
                this.el.modalSupport.classList.add('hidden');
            });
            this.el.modalSupport.addEventListener('click', (e) => {
                if (e.target === this.el.modalSupport) this.el.modalSupport.classList.add('hidden');
            });
        }

        // Listeners: Version/Changelog
        if (this.el.btnVersion) {
            this.el.btnVersion.addEventListener('click', () => {
                this.el.modalVersion.classList.remove('hidden');
            });
            this.el.btnCloseVersion.addEventListener('click', () => {
                this.el.modalVersion.classList.add('hidden');
            });
            this.el.modalVersion.addEventListener('click', (e) => {
                if (e.target === this.el.modalVersion) this.el.modalVersion.classList.add('hidden');
            });
        }

        // Listeners: Help Tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.target;
                // Buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                // Content
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
            });
        });

        // Initialize dynamic content
        this.loadNotice();
        this.loadSupport();
        this.loadVersion(); // Add version loading
        this.updateUI();
        // Listeners: Converter
        this.el.btnConverter = document.getElementById('btn-converter');
        this.el.modalConverter = document.getElementById('converter-modal');
        this.el.btnCloseConverter = document.getElementById('btn-close-converter');
        this.el.convInput = document.getElementById('conv-input');
        this.el.convUnit = document.getElementById('conv-unit');
        this.el.convResults = document.getElementById('conv-results');

        if (this.el.btnConverter) {
            this.el.btnConverter.addEventListener('click', () => {
                this.el.modalConverter.classList.remove('hidden');
                this.updateConverter();
            });
            this.el.btnCloseConverter.addEventListener('click', () => {
                this.el.modalConverter.classList.add('hidden');
            });
            this.el.modalConverter.addEventListener('click', (e) => {
                if (e.target === this.el.modalConverter) this.el.modalConverter.classList.add('hidden');
            });

            // Live Update
            this.el.convInput.addEventListener('input', () => this.updateConverter());
            this.el.convUnit.addEventListener('change', () => this.updateConverter());
        }

        // Listeners: Quick Input
        this.el.btnQuick = document.getElementById('btn-quick-input');
        this.el.modalQuick = document.getElementById('quick-input-modal');
        this.el.btnCloseQuick = document.getElementById('btn-close-quick');

        if (this.el.btnQuick) {
            this.el.btnQuick.addEventListener('click', () => {
                this.el.modalQuick.classList.remove('hidden');
            });
            this.el.btnCloseQuick.addEventListener('click', () => {
                this.el.modalQuick.classList.add('hidden');
            });
            this.el.modalQuick.addEventListener('click', (e) => {
                if (e.target === this.el.modalQuick) this.el.modalQuick.classList.add('hidden');
            });
        }

        // Listeners: Theme
        this.el.btnTheme = document.getElementById('btn-theme');
        this.el.modalTheme = document.getElementById('theme-modal');
        this.el.btnCloseTheme = document.getElementById('btn-close-theme');

        if (this.el.btnTheme) {
            this.el.btnTheme.addEventListener('click', () => {
                this.el.modalTheme.classList.remove('hidden');
                this.renderColorPresets();
            });
            this.el.btnCloseTheme.addEventListener('click', () => {
                this.el.modalTheme.classList.add('hidden');
            });
            this.el.modalTheme.addEventListener('click', (e) => {
                if (e.target === this.el.modalTheme) this.el.modalTheme.classList.add('hidden');
            });

            // Theme Buttons
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const theme = e.currentTarget.dataset.theme;
                    this.setTheme(theme);
                    // Close modal optional? Let's keep it open to see result.
                });
            });
        }

        // Custom Theme Logic (Live Update)
        const updateSliderValue = (slider) => {
            const id = slider.id.replace('theme-', 'val-');
            const valEl = document.getElementById(id);
            if (valEl) valEl.textContent = slider.value;
        };

        const updateCustomTheme = () => {
            const getVal = (id) => parseInt(document.getElementById(id).value) || 0;
            this.applyCustomTheme(
                { r: getVal('theme-btn-r'), g: getVal('theme-btn-g'), b: getVal('theme-btn-b') },
                { r: getVal('theme-bg-r'), g: getVal('theme-bg-g'), b: getVal('theme-bg-b') },
                { r: getVal('theme-main-r'), g: getVal('theme-main-g'), b: getVal('theme-main-b') },
                { r: getVal('theme-text-r'), g: getVal('theme-text-g'), b: getVal('theme-text-b') },
                { r: getVal('theme-dim-r'), g: getVal('theme-dim-g'), b: getVal('theme-dim-b') },
                { r: getVal('theme-btntxt-r'), g: getVal('theme-btntxt-g'), b: getVal('theme-btntxt-b') }
            );
        };

        const themeControls = document.getElementById('custom-theme-controls');
        if (themeControls) {
            themeControls.querySelectorAll('input[type="range"]').forEach(slider => {
                slider.addEventListener('input', () => {
                    updateSliderValue(slider);
                    updateCustomTheme();
                });
                // Initialize display values
                updateSliderValue(slider);
            });
        }

        this.el.btnApplyCustom = document.getElementById('btn-apply-custom');
        if (this.el.btnApplyCustom) {
            this.el.btnApplyCustom.addEventListener('click', updateCustomTheme);
        }

        // Preset Listeners
        if (this.el.btnSaveColorPreset) {
            this.el.btnSaveColorPreset.addEventListener('click', () => this.saveColorPreset());
        }
        if (this.el.btnSaveTimerPreset) {
            this.el.btnSaveTimerPreset.addEventListener('click', () => this.saveTimerPreset());
        }
        if (this.el.btnSaveBasePreset) {
            this.el.btnSaveBasePreset.addEventListener('click', () => this.saveBasePreset());
        }

        // Listeners: Backup
        if (this.el.btnBackup) {
            this.el.btnBackup.addEventListener('click', () => {
                this.el.modalBackup.classList.remove('hidden');
            });
            this.el.btnCloseBackup.addEventListener('click', () => {
                this.el.modalBackup.classList.add('hidden');
            });
            this.el.modalBackup.addEventListener('click', (e) => {
                if (e.target === this.el.modalBackup) this.el.modalBackup.classList.add('hidden');
            });
            this.el.btnExportSettings.addEventListener('click', () => this.exportSettings());
            this.el.btnImportSettings.addEventListener('click', () => this.importSettings());
        }

        // Listeners: Notice
        if (this.el.btnNotice) {
            this.el.btnNotice.addEventListener('click', () => {
                this.el.modalNotice.classList.remove('hidden');
            });
            this.el.btnCloseNotice.addEventListener('click', () => {
                this.el.modalNotice.classList.add('hidden');
            });
            this.el.modalNotice.addEventListener('click', (e) => {
                if (e.target === this.el.modalNotice) this.el.modalNotice.classList.add('hidden');
            });
        }

        // Load Notice
        // this.loadNotice(); // Moved above

        // Listeners: Unit-wise Inputs
        // Listeners: Unit-wise Inputs
        document.querySelectorAll('.unit-input-area').forEach(area => {
            const targetId = area.dataset.target;
            const targetInput = document.getElementById(targetId);
            const unitInputs = area.querySelectorAll('input');
            const previewEl = area.querySelector('.unit-preview');

            unitInputs.forEach(input => {
                input.addEventListener('input', () => {
                    let parts = [];
                    let totalSec = 0;
                    unitInputs.forEach(i => {
                        const val = parseFloat(i.value);
                        if (!isNaN(val) && val !== 0) {
                            parts.push(`${val}${i.dataset.unit}`);
                            totalSec += this.parseRichbInput(`${val}${i.dataset.unit}`);
                        }
                    });
                    targetInput.value = parts.join(' ');

                    // Update Real-time Preview
                    if (previewEl && totalSec > 0) {
                        previewEl.style.display = 'block';
                        const tView = new RichbTime(totalSec);
                        const rtView = this.formatRealTime(totalSec);
                        previewEl.innerHTML = `
                            <div style="color:var(--accent-cyan); font-weight:700;">${tView.toRichbString()}</div>
                            <div style="opacity:0.8;">(${rtView})</div>
                        `;
                    } else if (previewEl) {
                        previewEl.style.display = 'none';
                    }
                });
            });
        });

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('SW registered:', reg))
                .catch(err => console.error('SW reg failed:', err));
        }

        this.updateLoop();

        // Use Web Worker for background timing (prevents throttling)
        if (window.Worker) {
            this.timerWorker = new Worker('worker.js');
            this.timerWorker.onmessage = () => {
                this.updateLoop();
            };
        } else {
            // Fallback
            setInterval(() => this.updateLoop(), 50);
        }

        // Prevent accidental closing if timer is running
        window.addEventListener('beforeunload', (e) => {
            if (this.activeTimers.some(t => t.running) || this.activeAlarms.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },

    // Helper: linkify text (find URLs and convert to <a>)
    linkify(text) {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlPattern, (url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    },

    updateConverter() {
        const val = parseFloat(this.el.convInput.value);
        const unit = this.el.convUnit.value;
        if (isNaN(val)) {
            this.el.convResults.innerHTML = '<div style="grid-column:1/-1;">Invalid Input</div>';
            return;
        }

        // Convert to Seconds first
        let sec = 0;
        if (unit.length === 1 && UNITS[unit]) {
            sec = val * UNITS[unit].val;
        } else if (unit === 's') sec = val;
        else if (unit === 'm') sec = val * 60;
        else if (unit === 'h') sec = val * 3600;
        else if (unit === 'd') sec = val * 86400;

        // Output Targets
        const targets = [
            { u: 'Y', label: 'Y' },
            { u: 'Yr', label: 'Yr (Real)' },
            { u: 'U', label: 'U' },
            { u: 'é', label: 'é' },
            { u: 'I', label: 'Ī' },
            { u: 'o', label: 'o' },
            { u: 'L', label: 'L' },
            { u: 'p', label: 'p' },
            { u: 'd', label: 'Days' },
            { u: 'wk', label: 'Weeks' },
            { u: 'h', label: 'Hours' },
            { u: 'm', label: 'Mins' },
            { u: 's', label: 'Secs' },
        ];

        let html = '';
        targets.forEach(t => {
            if (t.u === unit) return; // Skip self

            let res = 0;
            // From Sec to Target
            if (t.u === 'Y') res = sec / UNITS.Y.val;
            else if (t.u === 'Yr') res = sec / 31536000;
            else if (t.u === 'U') res = sec / UNITS.U.val;
            else if (t.u === 'é') res = sec / UNITS['é'].val;
            else if (t.u === 'I') res = sec / UNITS.I.val;
            else if (t.u === 'o') res = sec / UNITS.o.val;
            else if (t.u === 'L') res = sec / UNITS.L.val;
            else if (t.u === 'p') res = sec / UNITS.p.val;
            else if (t.u === 'wk') res = sec / 604800;
            else if (t.u === 'd') res = sec / 86400;
            else if (t.u === 'h') res = sec / 3600;
            else if (t.u === 'm') res = sec / 60;
            else if (t.u === 's') res = sec;

            // Format
            let valStr = res < 0.001 && res > 0 ? res.toExponential(2) : res.toLocaleString(undefined, { maximumFractionDigits: 3 });

            html += `
                <div class="conv-item">
                    <span>${t.label}</span>
                    <div class="conv-val">${valStr}</div>
                </div>
            `;
        });
        this.el.convResults.innerHTML = html;
    },

    parseRichbInput(str) {
        // Support multiple values and units (e.g. "2m 30s")
        const regex = /([\d.]+)\s*([a-zA-Z\u0100-\u017Fé]+)/g;
        let totalSeconds = 0;
        let match;
        let found = false;

        while ((match = regex.exec(str)) !== null) {
            found = true;
            const val = parseFloat(match[1]);
            const unit = match[2];
            let modifier = 0;

            // Richb Units
            if (unit === 'L') modifier = UNITS.L.val;
            else if (unit === 'o') modifier = UNITS.o.val;
            else if (unit === 'I' || unit === 'Ī') modifier = UNITS.I.val;
            else if (unit === 'U') modifier = UNITS.U.val;
            else if (unit === 'Y') modifier = UNITS.Y.val;
            else if (unit === 'é') modifier = UNITS['é'].val;
            else if (unit === 'p') modifier = UNITS.L.val / 12;
            else if (unit === 'Yr') modifier = 31536000;
            // Real Time Units
            else if (unit === 's') modifier = 1;
            else if (unit === 'm') modifier = 60;
            else if (unit === 'h') modifier = 3600;
            else if (unit === 'Hr') modifier = 3600;
            else if (unit === 'wk') modifier = 604800;
            else if (unit === 'd') modifier = 86400;
            else continue;

            totalSeconds += val * modifier;
        }

        return found ? totalSeconds : null;
    },

    formatRealTime(totalSeconds) {
        if (totalSeconds < 0) totalSeconds = 0;

        const y = Math.floor(totalSeconds / 31536000); // 365 days
        totalSeconds %= 31536000;

        const d = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);

        let parts = [];
        if (y > 0) parts.push(`${y}y`);
        if (d > 0 || y > 0) parts.push(`${d}d`);
        if (h > 0 || d > 0 || y > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0 || d > 0 || y > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);

        return parts.join(' ');
    },

    setAlarm() {
        const input = this.el.alarmInput.value.trim();
        if (!input) return;

        const sec = this.parseRichbInput(input);
        if (sec !== null) {
            const id = Date.now();
            this.activeAlarms.push({
                id,
                targetSec: sec,
                triggered: false,
                label: input
            });
            this.saveSettings();
            this.renderActiveAlarms();
            // Optional: visual feedback
            this.el.alarmToggle.classList.add('active');
            setTimeout(() => this.el.alarmToggle.classList.remove('active'), 500);
        } else {
            alert(this.t('alert_invalid_format'));
        }
    },

    clearAlarm(id) {
        this.activeAlarms = this.activeAlarms.filter(a => a.id !== id);
        this.saveSettings();
        this.renderActiveAlarms();
        if (this.activeAlarms.length === 0) {
            this.el.clockMain.classList.remove('alarm-active');
        }
    },

    renderActiveAlarms() {
        if (!this.el.activeAlarmsList) return;
        this.el.activeAlarmsList.innerHTML = '';
        this.activeAlarms.forEach(alarm => {
            const item = document.createElement('div');
            item.className = 'active-item' + (alarm.triggered ? ' firing' : '');

            const rt = new RichbTime(alarm.targetSec * 1.245);
            // Simplified: we just show target Richb time
            const timeStr = rt.toRichbString();

            item.innerHTML = `
                <div class="item-info">
                    <span class="item-label">🔔 ${alarm.label || 'Alarm'}</span>
                    <span class="item-time">${timeStr}</span>
                </div>
                <button class="btn-cancel" onclick="App.clearAlarm(${alarm.id})">🗑️</button>
            `;
            this.el.activeAlarmsList.appendChild(item);
        });
    },

    // --- Timer Logic ---
    toggleTimer(presetValue) {
        this.sound.init();
        const now = Date.now();

        // If presetValue is provided, always start a new one
        if (presetValue) {
            const sec = this.parseRichbInput(presetValue);
            if (sec !== null) {
                this.addNewTimer(sec, presetValue);
            }
            return;
        }

        const input = this.el.timerInput.value.trim();
        if (!input) return;
        const sec = this.parseRichbInput(input);
        if (sec !== null) {
            this.addNewTimer(sec, input);
        } else {
            alert(this.t('alert_invalid_format'));
        }
    },

    addNewTimer(sec, label) {
        const id = Date.now();
        this.activeTimers.push({
            id,
            endTime: Date.now() + (sec * 1000),
            durationSec: sec,
            triggered: false,
            running: true,
            label,
            remainingOnPause: null
        });
        this.saveSettings();
        this.renderActiveTimers();
        this.el.timerDisplay.classList.remove('hidden');
    },

    pauseTimer(id) {
        const timer = this.activeTimers.find(t => t.id === id);
        if (timer && timer.running) {
            timer.running = false;
            timer.remainingOnPause = timer.endTime - Date.now();
            this.saveSettings();
            this.renderActiveTimers();
        }
    },

    resumeTimer(id) {
        const timer = this.activeTimers.find(t => t.id === id);
        if (timer && !timer.running && timer.remainingOnPause) {
            timer.endTime = Date.now() + timer.remainingOnPause;
            timer.remainingOnPause = null;
            timer.running = true;
            this.saveSettings();
            this.renderActiveTimers();
        }
    },

    resetTimer(id) {
        this.activeTimers = this.activeTimers.filter(t => t.id !== id);
        this.saveSettings();
        this.renderActiveTimers();
        if (this.activeTimers.length === 0) {
            this.el.timerDisplay.classList.add('hidden');
        }
    },

    renderActiveTimers() {
        if (!this.el.activeTimersList) return;
        this.el.activeTimersList.innerHTML = '';
        this.activeTimers.forEach(timer => {
            const item = document.createElement('div');
            item.className = 'active-item' + (timer.triggered ? ' firing' : '');

            let timeStr = "";
            let remainingSec = 0;
            if (timer.running) {
                remainingSec = (timer.endTime - Date.now()) / 1000;
            } else if (timer.remainingOnPause) {
                remainingSec = timer.remainingOnPause / 1000;
            }

            if (remainingSec <= 0) {
                timeStr = "0.0L";
            } else {
                const rt = new RichbTime(remainingSec);
                // Simple string representation for list
                timeStr = timer.label;
            }

            const playPauseBtn = timer.running ?
                `<button class="btn-cancel" style="margin-right:5px;" onclick="App.pauseTimer(${timer.id})">⏸</button>` :
                `<button class="btn-cancel" style="margin-right:5px;" onclick="App.resumeTimer(${timer.id})">▶</button>`;

            item.innerHTML = `
                <div class="item-info">
                    <span class="item-label">⏱️ ${timer.label}</span>
                    <span class="item-time" id="timer-val-${timer.id}">...</span>
                </div>
                <div style="display:flex;">
                    ${playPauseBtn}
                    <button class="btn-cancel" onclick="App.resetTimer(${timer.id})">🗑️</button>
                </div>
            `;
            this.el.activeTimersList.appendChild(item);
        });
    },

    // --- Common Sound Stop ---
    stopAllSound() {
        this.sound.stopAlarm();
        this.el.overlay.classList.add('hidden');

        // Silence all firing items
        this.activeAlarms.forEach(a => {
            if (a.triggered) this.clearAlarm(a.id);
        });
        this.activeTimers.forEach(t => {
            if (t.triggered) this.resetTimer(t.id);
        });

        this.el.clockMain.classList.remove('alarm-active');
        if (this.el.timerDisplay) this.el.timerDisplay.classList.remove('alarm-active');
    },

    setBaseToNow() {
        this.baseTime = Date.now();
        this.updateBaseTimeInput();
        this.saveSettings();
    },

    updateBaseTimeInput() {
        const d = new Date(this.baseTime);
        this.el.baseYr.value = d.getFullYear();
        this.el.baseMo.value = d.getMonth() + 1;
        this.el.baseDy.value = d.getDate();
        this.el.baseHr.value = d.getHours();
        this.el.baseMn.value = d.getMinutes();
        this.el.baseSc.value = d.getSeconds();
    },

    setMode(mode) {
        this.mode = mode;
        // Clean mode classes
        document.body.classList.remove('mode-normal', 'mode-compact', 'mode-view-only');
        document.body.classList.add(`mode-${mode}`);
        this.saveSettings();
    },

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = document.body.className.replace(/theme-[\w-]+/g, ''); // Remove old theme
        if (theme !== 'default' && theme !== 'custom') {
            document.body.classList.add(`theme-${theme}`);
        }
        if (theme === 'custom') {
            document.body.classList.add('theme-custom');
        }

        // Save
        this.saveSettings();
    },

    syncSliders(rgbSet) {
        if (!rgbSet) return;
        const setVal = (prefix, colorObj) => {
            if (!colorObj) return;
            ['r', 'g', 'b'].forEach(c => {
                const el = document.getElementById(`theme-${prefix}-${c}`);
                // Update 0-8 slider (convert if raw 0-255)
                if (el) {
                    let val = colorObj[c];
                    if (colorObj.isRaw) {
                        val = Math.round((val / 255) * 8);
                    }
                    el.value = val;
                    // Update the number display span
                    const valEl = document.getElementById(`val-${prefix}-${c}`);
                    if (valEl) valEl.textContent = val;
                }
            });
        };
        setVal('btn', rgbSet.btn);
        setVal('bg', rgbSet.bg);
        setVal('main', rgbSet.main);
        setVal('text', rgbSet.text);
        setVal('dim', rgbSet.dim);
        setVal('btntxt', rgbSet.btntxt);
    },

    syncRgb255Inputs(rgbSet) {
        if (!rgbSet) return;
        const setVal = (prefix, colorObj) => {
            if (!colorObj) return;
            let rVal, gVal, bVal;
            ['r', 'g', 'b'].forEach(c => {
                const el = document.getElementById(`rgb255-${prefix}-${c}`);
                if (el) {
                    let val = colorObj[c];
                    if (!colorObj.isRaw) {
                        val = Math.round((val / 8) * 255);
                    }
                    el.value = val;
                }
            });
            // Also sync HEX
            const hexEl = document.getElementById(`hex-${prefix}`);
            if (hexEl) {
                rVal = colorObj.isRaw ? colorObj.r : Math.round((colorObj.r / 8) * 255);
                gVal = colorObj.isRaw ? colorObj.g : Math.round((colorObj.g / 8) * 255);
                bVal = colorObj.isRaw ? colorObj.b : Math.round((colorObj.b / 8) * 255);
                hexEl.value = this.rgbToHex(rVal, gVal, bVal);
            }
        };
        setVal('btn', rgbSet.btn);
        setVal('bg', rgbSet.bg);
        setVal('main', rgbSet.main);
        setVal('text', rgbSet.text);
        setVal('dim', rgbSet.dim);
        setVal('btntxt', rgbSet.btntxt);
    },

    applyRgb255Theme() {
        const getVal = (id) => Math.min(255, Math.max(0, parseInt(document.getElementById(id).value) || 0));

        const c = (prefix) => ({
            r: getVal(`rgb255-${prefix}-r`),
            g: getVal(`rgb255-${prefix}-g`),
            b: getVal(`rgb255-${prefix}-b`)
        });

        this.applyCustomTheme(c('btn'), c('bg'), c('main'), c('text'), c('dim'), c('btntxt'), true);
        alert("RGB Colors Applied! 🎨");
    },

    // --- Color Presets ---
    saveColorPreset() {
        if (!this.customRGB) {
            alert(this.t('alert_config_custom'));
            return;
        }
        const name = prompt(this.t('prompt_preset_name'), `Preset ${this.savedColorPresets.length + 1}`);
        if (name === null) return;

        this.savedColorPresets.push({
            name: name || 'Unnamed',
            rgb: JSON.parse(JSON.stringify(this.customRGB))
        });
        this.saveSettings();
        this.renderColorPresets();
    },

    renderColorPresets() {
        if (!this.el.colorPresetsList) return;
        this.el.colorPresetsList.innerHTML = '';

        // Combine default and saved presets
        const allPresets = [...DEFAULT_COLOR_PRESETS.map(p => ({ ...p, isDefault: true })), ...this.savedColorPresets];

        allPresets.forEach((preset, index) => {
            const item = document.createElement('div');
            item.className = 'preset-item';

            // Generate swatch for visual reference
            const main = preset.rgb.main;
            const map = (v, raw) => raw ? v : Math.round((v / 8) * 255);
            const color = `rgb(${map(main.r, main.isRaw)}, ${map(main.g, main.isRaw)}, ${map(main.b, main.isRaw)})`;

            item.innerHTML = `
                <div class="color-preset-swatch" style="background:${color}"></div>
                <span class="val">${this.t('preset_' + preset.name.toLowerCase().replace(/\s+/g, '_'))}</span>
                ${preset.isDefault ? '' : `<button class="btn-delete-preset" data-index="${index}" title="Delete">×</button>`}
            `;
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-preset')) {
                    // Logic to find correct index in savedColorPresets
                    const savedIndex = this.savedColorPresets.findIndex(p => p.name === preset.name);
                    if (savedIndex !== -1) this.deleteColorPreset(savedIndex);
                } else {
                    this.applyCustomTheme(preset.rgb.btn, preset.rgb.bg, preset.rgb.main, preset.rgb.text, preset.rgb.dim, preset.rgb.btntxt);
                }
            });
            this.el.colorPresetsList.appendChild(item);
        });
    },

    deleteColorPreset(index) {
        if (confirm(this.t('confirm_delete_color'))) {
            this.savedColorPresets.splice(index, 1);
            this.saveSettings();
            this.renderColorPresets();
        }
    },

    // --- Timer Presets ---
    saveTimerPreset() {
        const input = this.el.timerInput.value.trim();
        if (!input) {
            alert(this.t('alert_enter_timer'));
            return;
        }

        const name = prompt(this.t('timer_presets_prompt'), input);
        if (name === null) return;

        this.savedTimerPresets.push({
            name: name || input,
            value: input
        });
        this.saveSettings();
        this.renderTimerPresets();
    },

    renderTimerPresets() {
        if (!this.el.timerPresetsList) return;
        this.el.timerPresetsList.innerHTML = '';
        this.savedTimerPresets.forEach((preset, index) => {
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.innerHTML = `
                <span class="val">${preset.name}</span>
                <button class="btn-delete-preset" data-index="${index}" title="Delete">×</button>
            `;
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-preset')) {
                    this.deleteTimerPreset(index);
                } else {
                    this.el.timerInput.value = preset.value;
                    this.toggleTimer(preset.value);
                }
            });
            this.el.timerPresetsList.appendChild(item);
        });
    },

    deleteTimerPreset(index) {
        if (confirm(this.t('confirm_delete_timer'))) {
            this.savedTimerPresets.splice(index, 1);
            this.saveSettings();
            this.renderTimerPresets();
        }
    },

    // --- Base Point Presets ---
    saveBasePreset() {
        const yr = this.el.baseYr.value;
        const mo = this.el.baseMo.value;
        const dy = this.el.baseDy.value;
        const hr = this.el.baseHr.value;
        const mn = this.el.baseMn.value;
        const sc = this.el.baseSc.value;

        const dateStr = `${yr}/${mo}/${dy} ${hr}:${mn}:${sc}`;
        const name = prompt(this.t('prompt_base_label'), dateStr);
        if (name === null) return;

        this.savedBasePresets.push({
            name: name || dateStr,
            time: this.baseTime
        });
        this.saveSettings();
        this.renderBasePresets();
    },

    renderBasePresets() {
        if (!this.el.basePresetsList) return;
        this.el.basePresetsList.innerHTML = '';
        this.savedBasePresets.forEach((preset, index) => {
            const isCreation = (preset.name === "Since Creation");
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.innerHTML = `
                <span class="val">${preset.name}</span>
                ${isCreation ? '' : `<button class="btn-delete-preset" data-index="${index}" title="Delete">×</button>`}
            `;
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete-preset')) {
                    this.deleteBasePreset(index);
                } else {
                    this.baseTime = preset.time;
                    this.updateBaseTimeInput();
                    this.saveSettings();
                }
            });
            this.el.basePresetsList.appendChild(item);
        });
    },

    deleteBasePreset(index) {
        const preset = this.savedBasePresets[index];
        if (preset && preset.name === "Since Creation") return; // Safety

        if (confirm(this.t('confirm_delete'))) {
            this.savedBasePresets.splice(index, 1);
            this.saveSettings();
            this.renderBasePresets();
        }
    },

    applyCustomTheme(btnRGB, bgRGB, mainRGB, textRGB, dimRGB, btnTxtRGB, isRaw = false) {
        // Validation: Ensure valid objects or default to 0
        const validate = (obj) => {
            const r = parseInt(obj?.r) || 0;
            const g = parseInt(obj?.g) || 0;
            const b = parseInt(obj?.b) || 0;
            if (isRaw || (obj && obj.isRaw)) {
                return {
                    r: Math.min(255, Math.max(0, r)),
                    g: Math.min(255, Math.max(0, g)),
                    b: Math.min(255, Math.max(0, b)),
                    isRaw: true
                };
            } else {
                return {
                    r: Math.min(8, Math.max(0, r)),
                    g: Math.min(8, Math.max(0, g)),
                    b: Math.min(8, Math.max(0, b)),
                    isRaw: false
                };
            }
        };

        const btn = validate(btnRGB);
        const bg = validate(bgRGB);
        const main = validate(mainRGB);
        const text = textRGB ? validate(textRGB) : validate(mainRGB);
        const dim = dimRGB ? validate(dimRGB) : {
            r: Math.floor(text.r * 0.6),
            g: Math.floor(text.g * 0.6),
            b: Math.floor(text.b * 0.6),
            isRaw: text.isRaw
        };
        // Default button text to dark if not provided, or contrasting
        const btntxt = btnTxtRGB ? validate(btnTxtRGB) : { r: 1, g: 1, b: 2, isRaw: false }; // Default fallback uses 0-8 logic if simple fallback, but let's just stick to explicit inputs usually.

        // Helper: 0-8 or raw 0-255
        const map = (val, raw) => raw ? val : Math.round((val / 8) * 255);
        const toCol = (obj) => `rgb(${map(obj.r, obj.isRaw)}, ${map(obj.g, obj.isRaw)}, ${map(obj.b, obj.isRaw)})`;
        const toAlpha = (obj, a) => `rgba(${map(obj.r, obj.isRaw)}, ${map(obj.g, obj.isRaw)}, ${map(obj.b, obj.isRaw)}, ${a})`;

        // Set CSS Variables
        const docStyle = document.documentElement.style;
        docStyle.setProperty('--custom-btn-color', toCol(btn));
        docStyle.setProperty('--custom-bg-color', toCol(bg));
        docStyle.setProperty('--custom-main-color', toCol(main));
        docStyle.setProperty('--custom-text-color', toCol(text));
        docStyle.setProperty('--custom-dim-color', toCol(dim));
        docStyle.setProperty('--custom-btntxt-color', toCol(btntxt));
        docStyle.setProperty('--custom-panel-bg', toAlpha(bg, 0.5)); // Derived from BG
        document.documentElement.style.setProperty('--accent-cyan', toCol(main)); // Ensure ticker follows theme

        // Save State
        this.customRGB = { btn, bg, main, text, dim, btntxt };
        this.setTheme('custom');

        // Sync Both
        this.syncSliders(this.customRGB);
        this.syncRgb255Inputs(this.customRGB);
    },


    loadSettings() {
        // 1. Raw Loading from LocalStorage
        const storedBase = localStorage.getItem('richb_baseTime');
        const storedMode = localStorage.getItem('richb_mode');
        const storedTheme = localStorage.getItem('richb_theme');
        const storedRGB = localStorage.getItem('richb_customRGB');
        const storedColorPresets = localStorage.getItem('richb_colorPresets');
        const storedTimerPresets = localStorage.getItem('richb_timerPresets');
        const storedBasePresets = localStorage.getItem('richb_basePresets');
        const storedActiveAlarms = localStorage.getItem('richb_activeAlarms');
        const storedActiveTimers = localStorage.getItem('richb_activeTimers');

        // 2. Set internal state silently (without triggering saveSettings)
        if (storedBase) this.baseTime = parseInt(storedBase, 10);
        else this.setBaseToNow();

        this.mode = storedMode || 'normal';
        this.language = localStorage.getItem('richb_lang') || 'ja';
        this.currentTheme = storedTheme || 'default';

        if (storedColorPresets) {
            try { this.savedColorPresets = JSON.parse(storedColorPresets); } catch (e) { }
        }
        if (storedTimerPresets) {
            try { this.savedTimerPresets = JSON.parse(storedTimerPresets); } catch (e) { }
        }
        if (storedBasePresets) {
            try { this.savedBasePresets = JSON.parse(storedBasePresets); } catch (e) { }
        }

        // If list is empty, add default "Since Creation"
        if (this.savedBasePresets.length === 0) {
            this.savedBasePresets = [{
                name: "Since Creation",
                time: new Date(2026, 0, 5, 18, 19, 0).getTime()
            }];
        }

        // 3. Apply Theme & Mode Classes (Manual version of setMode/setTheme to avoid save)
        document.body.className = document.body.className.replace(/theme-[\w-]+/g, '').replace(/mode-[\w-]+/g, '');
        document.body.classList.add(`mode-${this.mode}`);

        if (this.currentTheme === 'custom' && storedRGB) {
            try {
                const rgb = JSON.parse(storedRGB);
                if (rgb.r !== undefined) {
                    this.applyCustomTheme({ r: rgb.r, g: rgb.g, b: rgb.b }, { r: 0, g: 0, b: 0 }, { r: rgb.r, g: rgb.g, b: rgb.b }, { r: rgb.r, g: rgb.g, b: rgb.b }, { r: rgb.r, g: rgb.g, b: rgb.b }, { r: 1, g: 1, b: 2 });
                } else {
                    this.applyCustomTheme(rgb.btn, rgb.bg, rgb.main, rgb.text, rgb.dim, rgb.btntxt);
                    // Populate inputs
                    const populate = (prefix, obj) => {
                        if (obj) {
                            const r = document.getElementById(`theme-${prefix}-r`);
                            const g = document.getElementById(`theme-${prefix}-g`);
                            const b = document.getElementById(`theme-${prefix}-b`);
                            if (r) r.value = obj.r;
                            if (g) g.value = obj.g;
                            if (b) b.value = obj.b;
                        }
                    };
                    populate('btn', rgb.btn);
                    populate('bg', rgb.bg);
                    populate('main', rgb.main);
                    populate('text', rgb.text);
                    populate('dim', rgb.dim);
                    populate('btntxt', rgb.btntxt);
                }
            } catch (e) { console.error("Theme load failed", e); }
        } else if (this.currentTheme !== 'default') {
            document.body.classList.add(`theme-${this.currentTheme}`);
        }

        // 4. Render UI
        this.renderColorPresets();
        this.renderTimerPresets();
        this.renderBasePresets();

        // 5. Active Lists
        try {
            if (storedActiveAlarms) {
                this.activeAlarms = JSON.parse(storedActiveAlarms) || [];
                this.renderActiveAlarms();
            }
        } catch (e) { this.activeAlarms = []; }

        try {
            if (storedActiveTimers) {
                this.activeTimers = JSON.parse(storedActiveTimers) || [];
                // Try rendering separately to avoid wiping data on render error
                try {
                    this.renderActiveTimers();
                } catch (renderErr) {
                    console.error("Failed to render timers on load:", renderErr);
                }
            }
        } catch (e) {
            console.error("Failed to load active timers:", e);
            this.activeTimers = [];
        }

        // Restore Inputs
        this.el.alarmInput.value = localStorage.getItem('richb_lastAlarmInput') || '';
        this.el.timerInput.value = localStorage.getItem('richb_lastTimerInput') || '';

        this.updateBaseTimeInput();

        // 6. Font Settings
        const storedFont = localStorage.getItem('richb_font');
        if (storedFont) {
            this.setFont(storedFont);
            if (this.el.selectFont) this.el.selectFont.value = storedFont;
        }
    },

    saveSettings() {
        localStorage.setItem('richb_baseTime', this.baseTime);
        localStorage.setItem('richb_mode', this.mode);
        localStorage.setItem('richb_theme', this.currentTheme);
        if (this.currentTheme === 'custom' && this.customRGB) {
            localStorage.setItem('richb_customRGB', JSON.stringify(this.customRGB));
        }
        localStorage.setItem('richb_colorPresets', JSON.stringify(this.savedColorPresets));
        localStorage.setItem('richb_timerPresets', JSON.stringify(this.savedTimerPresets));
        localStorage.setItem('richb_basePresets', JSON.stringify(this.savedBasePresets));

        localStorage.setItem('richb_activeAlarms', JSON.stringify(this.activeAlarms));
        localStorage.setItem('richb_activeTimers', JSON.stringify(this.activeTimers));

        localStorage.setItem('richb_lastAlarmInput', this.el.alarmInput.value);
        localStorage.setItem('richb_lastTimerInput', this.el.timerInput.value);
        localStorage.setItem('richb_lang', this.language);
        localStorage.setItem('richb_font', this.selectedFont || 'inherit');
    },

    exportSettings() {
        const settings = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('richb_')) {
                settings[key] = localStorage.getItem(key);
            }
        }
        const json = JSON.stringify(settings, null, 2);
        this.el.backupData.value = json;
        this.el.backupData.select();
        try {
            document.execCommand('copy');
            alert(this.t('alert_exported'));
        } catch (e) {
            alert(this.t('alert_exported_no_copy'));
        }
    },

    importSettings() {
        const json = this.el.backupData.value.trim();
        if (!json) {
            alert(this.t('alert_import_empty'));
            return;
        }

        if (!confirm(this.t('confirm_restore'))) {
            return;
        }

        try {
            const settings = JSON.parse(json);

            // Validate it's a settings object (optional but good)
            const keys = Object.keys(settings);
            if (keys.length === 0 || !keys.some(k => k.startsWith('richb_'))) {
                throw new Error("Doesn't look like valid Richb Timer settings.");
            }

            // Clear ALL current richb_ settings safely
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('richb_')) {
                    localStorage.removeItem(key);
                }
            });

            // Apply new settings
            for (const key in settings) {
                if (key.startsWith('richb_')) {
                    localStorage.setItem(key, settings[key]);
                }
            }

            alert(this.t('restore_success'));
            // Force reload and bypass any 'onunload' saves if any
            window.location.href = window.location.href;
        } catch (e) {
            alert('Invalid backup data! ❌\nError: ' + e.message);
            console.error(e);
        }
    },

    updateLoop() {
        try {
            const now = Date.now();
            if (now - this.lastUpdate < 16) {
                // Cap at ~60fps, but still schedule next frame
                requestAnimationFrame(() => this.updateLoop());
                return;
            }
            this.lastUpdate = now;

            // 1. Process Main Clock
            const diffMs = now - this.baseTime;
            const diffSec = diffMs / 1000;
            const rt = new RichbTime(diffSec);
            this.el.clockMain.innerHTML = rt.toRichbString();

            // --- REAL TIME CLOCK UPDATE ---
            // Format: YYYY Yr MM month DD day HH:mm:ss.s
            const d = new Date();
            const yyyy = d.getFullYear();
            const mm = (d.getMonth() + 1).toString().padStart(2, '0');
            const dd = d.getDate().toString().padStart(2, '0');
            const hh = d.getHours().toString().padStart(2, '0');
            const min = d.getMinutes().toString().padStart(2, '0');
            const ss = d.getSeconds().toString().padStart(2, '0');
            const msec = Math.floor(d.getMilliseconds() / 100); // Tenths

            this.el.clockReal.textContent = `${yyyy} ${this.t('unit_yr')} ${mm} ${this.t('unit_mo')} ${dd} ${this.t('unit_dy')} ${hh}:${min}:${ss}.${msec}`;

            // --- ELAPSED REAL TIME ---
            // YYYY Year MM month DD day HH:mm:ss.s
            // We calculate delta since baseTime
            let deltaSec = diffSec;
            const years = Math.floor(deltaSec / 31536000);
            deltaSec %= 31536000;
            const months = Math.floor(deltaSec / 2592000); // Rough 30-day month
            deltaSec %= 2592000;
            const days = Math.floor(deltaSec / 86400);
            deltaSec %= 86400;
            const hours = Math.floor(deltaSec / 3600);
            deltaSec %= 3600;
            const mins = Math.floor(deltaSec / 60);
            deltaSec %= 60;
            const secs = Math.floor(deltaSec);
            const tenths = Math.floor((diffMs % 1000) / 100);

            const pad = (v) => v.toString().padStart(2, '0');

            this.el.clockElapsedReal.textContent = `${this.t('elapsed_label')} ${years} ${this.t('unit_yr')} ${pad(months)} ${this.t('unit_mo')} ${pad(days)} ${this.t('unit_dy')} ${pad(hours)}:${pad(mins)}:${pad(secs)}.${tenths}`;

            // 2. Process Alarms
            this.activeAlarms.forEach(alarm => {
                if (!alarm.triggered && diffSec >= alarm.targetSec) {
                    alarm.triggered = true;
                    this.fireAlarm();
                    this.renderActiveAlarms(); // Update UI to show firing state
                    this.saveSettings(); // Save triggered state
                }
            });

            // 3. Process Timers
            let primaryTimer = null; // To show on the main display
            this.activeTimers.forEach(timer => {
                if (timer.running) {
                    const outputMs = timer.endTime - now;
                    if (outputMs <= 0) {
                        if (!timer.triggered) {
                            timer.triggered = true;
                            timer.running = false;
                            this.fireAlarm();
                            this.renderActiveTimers();
                            this.saveSettings();
                        }
                    } else {
                        const remainingSec = outputMs / 1000;
                        const tView = new RichbTime(remainingSec);
                        const rtView = this.formatRealTime(remainingSec);

                        // Update display in list if exists
                        const valEl = document.getElementById(`timer-val-${timer.id}`);
                        if (valEl) {
                            valEl.innerHTML = `${tView.toRichbString()} (${rtView})`;
                        }

                        // Set as primary if needed (soonest one)
                        if (!primaryTimer || timer.endTime < primaryTimer.endTime) {
                            primaryTimer = timer;
                        }
                    }
                } else if (timer.remainingOnPause) {
                    const remainingSec = timer.remainingOnPause / 1000;
                    const tView = new RichbTime(remainingSec);
                    const rtView = this.formatRealTime(remainingSec);
                    const valEl = document.getElementById(`timer-val-${timer.id}`);
                    if (valEl) valEl.innerHTML = `PAUSED - ${tView.toRichbString()}`;
                } else if (timer.triggered) {
                    const valEl = document.getElementById(`timer-val-${timer.id}`);
                    if (valEl) valEl.innerHTML = `<span style="color:var(--accent-red)">UP!</span>`;
                }
            });

            // Show ALL active timers in the top display
            if (this.activeTimers.length > 0) {
                this.el.timerDisplay.classList.remove('hidden');
                let timerHTML = '';
                this.activeTimers.forEach(timer => {
                    const remainingSec = timer.running ? (timer.endTime - now) / 1000 : (timer.remainingOnPause || 0) / 1000;
                    const tView = new RichbTime(remainingSec);
                    const rtView = this.formatRealTime(remainingSec);
                    const status = timer.running ? '' : ' <span style="font-size:0.8rem;">(PAUSED)</span>';
                    timerHTML += `
                        <div class="timer-item-top" style="margin-bottom:0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
                            <div style="font-size:0.9rem; color:var(--text-dim);">${timer.label} ${status}</div>
                            <div style="font-size:1.8rem; font-weight:700;">${tView.toRichbString()}</div>
                            <div style="font-size:0.9rem; opacity:0.7;">(${rtView})</div>
                        </div>
                    `;
                });
                this.el.timerDisplay.innerHTML = timerHTML;
            } else {
                this.el.timerDisplay.classList.add('hidden');
                this.el.timerDisplay.textContent = '0.0L';
            }
        } catch (e) {
            console.error('updateLoop error:', e);
        }

        requestAnimationFrame(() => this.updateLoop());
    },

    fireAlarm() {
        // This function is called for both time-based alarm and countdown timer
        // The specific trigger (alarmTriggered or timerTriggered) is set by the caller
        this.sound.startAlarm();

        // Notification
        this.sendNotification();

        // Main Clock Flash
        this.el.clockMain.classList.add('alarm-active');
        if (this.el.timerDisplay) this.el.timerDisplay.classList.add('alarm-active');

        // Overlay Show
        this.el.overlay.classList.remove('hidden');

        // Auto Reset Color after 2.5s
        setTimeout(() => {
            this.el.clockMain.classList.remove('alarm-active');
            if (this.el.timerDisplay) {
                this.el.timerDisplay.classList.remove('alarm-active');
                // Also reset timer text color if it was red
                this.el.timerDisplay.style.color = 'var(--text-main)';
            }
        }, 2500);
    },

    requestNotificationPermission() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    },

    sendNotification() {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            // Use ServiceWorker registration if available for better mobile support
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('Richb Timer', {
                        body: this.t('time_is_up'),
                        icon: 'icon.png',
                        vibrate: [200, 100, 200]
                    });
                });
            } else {
                new Notification('Richb Timer', {
                    body: 'Time is up!',
                    icon: 'icon.png'
                });
            }
        }
    },

    async loadNotice() {
        try {
            const response = await fetch('notice.txt?t=' + Date.now(), { cache: 'no-store' });
            if (!response.ok) throw new Error('Notice fetch failed');
            const text = await response.text();
            const allLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

            // Ticker: First 4 lines
            const tickerLines = allLines.slice(0, 4);
            if (tickerLines.length > 0) {
                this.el.tickerContent.textContent = tickerLines.join(' | ');
            } else {
                this.el.tickerContent.textContent = this.t('help_update_desc');
            }

            // Modal: Full content
            this.el.noticeFullContent.textContent = text;

        } catch (e) {
            console.error('Failed to load notice.txt:', e);
            this.el.tickerContent.textContent = this.t('help_update_desc');
            this.el.noticeFullContent.textContent = this.t('help_update_desc');
        }
    },

    async loadSupport() {
        console.log('loadSupport called. Current language:', this.language);
        try {
            // Fetch file based on language (ja -> support.txt, others -> support_xx.txt or support_en.txt)
            let fileName = 'support.txt';
            if (this.language !== 'ja') {
                fileName = `support_${this.language}.txt`;
            }
            console.log('Fetching support file:', fileName);

            const response = await fetch(fileName + '?t=' + Date.now(), { cache: 'no-store' });

            // Fallback to support.txt (JA) if localized file not found
            let text;
            if (!response.ok) {
                if (fileName !== 'support.txt') {
                    const fallbackResponse = await fetch('support.txt?t=' + Date.now(), { cache: 'no-store' });
                    text = fallbackResponse.ok ? await fallbackResponse.text() : "Support content not found.";
                } else {
                    throw new Error('Support fetch failed');
                }
            } else {
                text = await response.text();
            }

            // Linkify and set innerHTML
            if (this.el.supportFullContent) {
                this.el.supportFullContent.innerHTML = this.linkify(text);
            }
        } catch (e) {
            console.error(e);
            if (this.el.supportFullContent) {
                this.el.supportFullContent.innerHTML = this.linkify("GitHub Repository: https://github.com/disxord888-hash/Richb_timer/tree/main");
            }
        }
    },

    async loadVersion() {
        console.log('loadVersion called');
        try {
            const response = await fetch('version.txt?t=' + Date.now(), { cache: 'no-store' });
            console.log('version.txt fetch status:', response.status);
            if (response.ok) {
                const text = await response.text();
                console.log('version.txt text length:', text.length);
                const lines = text.split(/\r?\n/);
                console.log('version.txt lines:', lines.slice(0, 5));

                // Footer: Only show lines 2 and 3 (version and date)
                const verEl = document.getElementById('app-version');
                if (verEl) {
                    if (lines.length >= 3) {
                        verEl.textContent = `Version: ${lines[1]} ${lines[2]}`;
                    } else if (lines.length >= 2) {
                        verEl.textContent = `Version: ${lines[1]}`;
                    } else {
                        verEl.textContent = 'Version: v0.11.1α';
                    }
                    console.log('Footer version set to:', verEl.textContent);
                }

                // Store full content for changelog modal
                if (this.el.versionFullContent) {
                    console.log('Setting versionFullContent (element exists)');
                    this.el.versionFullContent.innerHTML = this.linkify ? this.linkify(text) : text.replace(/\n/g, '<br>');
                } else {
                    console.error('versionFullContent element NOT found in this.el');
                    // Try to get it directly just in case
                    const directEl = document.getElementById('version-full-content');
                    if (directEl) {
                        directEl.innerHTML = this.linkify ? this.linkify(text) : text.replace(/\n/g, '<br>');
                        this.el.versionFullContent = directEl;
                    }
                }
            } else {
                console.error('Fetch failed with status:', response.status);
                const verEl = document.getElementById('app-version');
                if (verEl) verEl.textContent = 'Version: v0.11.1α';
            }
        } catch (e) {
            console.error("Version load failed", e);
            const verEl = document.getElementById('app-version');
            if (verEl) verEl.textContent = 'Version: v0.11.1α';
        }
    }

};

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
