import { useCallback, useEffect, useRef, useState } from 'react';
import type { TargetFramework } from '@open-design/contracts';
import { FRAMEWORKS } from '@open-design/contracts';
import { Icon, type IconName } from './Icon';

const STORAGE_KEY = 'open-design:framework';

interface Props {
  value: TargetFramework;
  onChange: (framework: TargetFramework) => void;
}

export function FrameworkSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const active = FRAMEWORKS.find((f) => f.id === value) ?? FRAMEWORKS[0]!;

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      closeMenu();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, open]);

  return (
    <div className="framework-selector" ref={rootRef}>
      <button
        type="button"
        className={`framework-selector__trigger${open ? ' is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={active.name}
        data-testid="framework-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={active.icon as IconName} size={13} />
        <span className="framework-selector__label">{active.name}</span>
        <Icon name="chevron-down" size={12} />
      </button>
      {open ? (
        <div className="framework-selector__popover">
          <div className="framework-selector__menu" role="listbox">
            {FRAMEWORKS.map((fw) => {
              const itemActive = fw.id === value;
              return (
                <button
                  key={fw.id}
                  type="button"
                  role="option"
                  aria-selected={itemActive}
                  className={`framework-selector__option${itemActive ? ' is-active' : ''}`}
                  data-testid={`framework-option-${fw.id}`}
                  onClick={() => {
                    if (!itemActive) onChange(fw.id);
                    closeMenu();
                  }}
                >
                  <Icon name={fw.icon as IconName} size={13} />
                  <span className="framework-selector__option-content">
                    <span className="framework-selector__option-name">{fw.name}</span>
                    <span className="framework-selector__option-desc">{fw.description}</span>
                  </span>
                  <span className="framework-selector__check" aria-hidden>
                    {itemActive ? <Icon name="check" size={13} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function readPreferredFramework(): TargetFramework {
  if (typeof window === 'undefined') return 'html';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && FRAMEWORKS.some((f) => f.id === stored)) return stored as TargetFramework;
  } catch {
    // ignore
  }
  return 'html';
}

export function writePreferredFramework(id: TargetFramework): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function frameworkSkillId(framework: TargetFramework): string | undefined {
  return FRAMEWORKS.find((f) => f.id === framework)?.skillId;
}
