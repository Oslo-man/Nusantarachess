interface ActionIconProps {
  className?: string;
}

export function ResignIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-resign" + (className ? " " + className : "")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 3.25C5 2.56 5.56 2 6.25 2S7.5 2.56 7.5 3.25v17.5c0 .69-.56 1.25-1.25 1.25S5 21.44 5 20.75z" />
      <path d="M7.5 3.5h11.7a.9.9 0 0 1 .74 1.41L17.3 8.5l2.64 3.59a.9.9 0 0 1-.74 1.41H7.5z" />
    </svg>
  );
}

export function UndoIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-undo" + (className ? " " + className : "")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.4 9.5 10 4.2a.9.9 0 0 1 1.46.7v9.2a.9.9 0 0 1-1.46.7z" />
      <path d="M10 9.5h5.5a4.5 4.5 0 0 1 0 9H8.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ExitIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-exit" + (className ? " " + className : "")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 12 9.6 6.7a.9.9 0 0 1 1.46.7v9.2a.9.9 0 0 1-1.46.7z" />
      <path d="M10.5 12H20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ReviewIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-review" + (className ? " " + className : "")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" style={{ fill: "var(--brand, #81B64C)" }} />
      <circle cx="12" cy="12" r="6.3" fill="#fff" />
      <path d="M12.00 8.40L12.96 10.97L15.71 11.09L13.56 12.81L14.29 15.46L12.00 13.94L9.71 15.46L10.44 12.81L8.29 11.09L11.04 10.97z" strokeWidth="0.9" strokeLinejoin="round" style={{ fill: "var(--brand, #81B64C)", stroke: "var(--brand, #81B64C)" }} />
    </svg>
  );
}

export function OptionsIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-options" + (className ? " " + className : "")} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="5" cy="6.5" r="1.7" />
      <rect x="9" y="5.2" width="11" height="2.6" rx="1.3" />
      <circle cx="5" cy="12" r="1.7" />
      <rect x="9" y="10.7" width="11" height="2.6" rx="1.3" />
      <circle cx="5" cy="17.5" r="1.7" />
      <rect x="9" y="16.2" width="11" height="2.6" rx="1.3" />
    </svg>
  );
}

export function SettingsIcon({ className }: ActionIconProps) {
  return (
    <svg className={"act-ico act-ico-settings" + (className ? " " + className : "")} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <path d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303zM281.292,329.698c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088C339.815,267.771,320.972,313.262,281.292,329.698z" />
    </svg>
  );
}
