/**
 * Property Panel - Edit block props and styles
 */

import React, { useMemo, useCallback } from 'react';
import type { Block, PropSchema } from '@open-design/blocks';
import { blockRegistry } from '@open-design/blocks';
import { useEditorStore } from './useEditorStore';

export function PropertyPanel() {
  const { blocks, selectedBlockId, updateBlock } = useEditorStore();

  // Find selected block
  const selectedBlock = useMemo(() => {
    if (!selectedBlockId) return null;
    
    const findBlock = (blocks: Block[], id: string): Block | null => {
      for (const block of blocks) {
        if (block.id === id) return block;
        const found = findBlock(block.children, id);
        if (found) return found;
      }
      return null;
    };
    
    return findBlock(blocks, selectedBlockId);
  }, [blocks, selectedBlockId]);

  const definition = useMemo(() => {
    if (!selectedBlock) return null;
    return blockRegistry.get(selectedBlock.type);
  }, [selectedBlock]);

  const handlePropChange = useCallback(
    (propName: string, value: any) => {
      if (!selectedBlock) return;
      updateBlock(selectedBlock.id, {
        props: { ...selectedBlock.props, [propName]: value },
      });
    },
    [selectedBlock, updateBlock]
  );

  const handleStyleChange = useCallback(
    (styleName: string, value: string) => {
      if (!selectedBlock) return;
      updateBlock(selectedBlock.id, {
        styles: { ...selectedBlock.styles, [styleName]: value },
      });
    },
    [selectedBlock, updateBlock]
  );

  if (!selectedBlock || !definition) {
    return (
      <div className="property-panel">
        <div className="property-panel-empty">
          <div className="empty-icon">🎨</div>
          <div className="empty-title">No block selected</div>
          <div className="empty-subtitle">
            Select a block to edit its properties
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="property-panel">
      {/* Block info */}
      <div className="property-panel-header">
        <div className="block-type-icon">{definition.icon}</div>
        <div className="block-type-info">
          <div className="block-type-name">{definition.name}</div>
          <div className="block-type-id">{selectedBlock.id}</div>
        </div>
      </div>

      {/* Props section */}
      <div className="property-section">
        <div className="section-title">Properties</div>
        <div className="section-content">
          {definition.propSchema.map((prop: PropSchema) => (
            <PropertyField
              key={prop.name}
              prop={prop}
              value={selectedBlock.props[prop.name]}
              onChange={(value: any) => handlePropChange(prop.name, value)}
            />
          ))}
        </div>
      </div>

      {/* Styles section */}
      <div className="property-section">
        <div className="section-title">Styles</div>
        <div className="section-content">
          {Object.entries(selectedBlock.styles).map(([key, value]) => (
            <StyleField
              key={key}
              name={key}
              value={value as string}
              onChange={(newValue: string) => handleStyleChange(key, newValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Property Field - Renders input based on prop type
 */
interface PropertyFieldProps {
  prop: PropSchema;
  value: any;
  onChange: (value: any) => void;
}

function PropertyField({ prop, value, onChange }: PropertyFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let newValue: any = e.target.value;

    // Type conversion
    if (prop.type === 'number') {
      newValue = parseFloat(newValue);
    } else if (prop.type === 'boolean') {
      newValue = (e.target as HTMLInputElement).checked;
    }

    onChange(newValue);
  };

  const label = (
    <label className="property-field-label">
      {prop.label}
      {prop.required && <span className="required">*</span>}
    </label>
  );

  const description = prop.description && (
    <div className="property-field-description">{prop.description}</div>
  );

  switch (prop.type) {
    case 'string':
    case 'url':
    case 'image':
    case 'color':
      return (
        <div className="property-field">
          {label}
          <input
            type={prop.type === 'color' ? 'color' : prop.type === 'url' ? 'url' : 'text'}
            value={value || ''}
            onChange={handleChange}
            placeholder={prop.placeholder}
            className="property-field-input"
          />
          {description}
        </div>
      );

    case 'text':
      return (
        <div className="property-field">
          {label}
          <textarea
            value={value || ''}
            onChange={handleChange}
            placeholder={prop.placeholder}
            className="property-field-textarea"
            rows={3}
          />
          {description}
        </div>
      );

    case 'number':
      return (
        <div className="property-field">
          {label}
          <input
            type="number"
            value={value || ''}
            onChange={handleChange}
            min={prop.validation?.min}
            max={prop.validation?.max}
            className="property-field-input"
          />
          {description}
        </div>
      );

    case 'boolean':
      return (
        <div className="property-field property-field-checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value || false}
              onChange={handleChange}
              className="property-field-checkbox-input"
            />
            <span>{prop.label}</span>
          </label>
          {description}
        </div>
      );

    case 'select':
      return (
        <div className="property-field">
          {label}
          <select
            value={value || ''}
            onChange={handleChange}
            className="property-field-select"
          >
            {prop.options?.map((option: { value: string; label: string }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {description}
        </div>
      );

    default:
      return (
        <div className="property-field">
          {label}
          <div className="property-field-unsupported">
            Unsupported type: {prop.type}
          </div>
        </div>
      );
  }
}

/**
 * Style Field - Simple text input for Tailwind classes
 */
interface StyleFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

function StyleField({ name, value, onChange }: StyleFieldProps) {
  return (
    <div className="property-field">
      <label className="property-field-label">{name}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tailwind classes..."
        className="property-field-input"
      />
    </div>
  );
}
