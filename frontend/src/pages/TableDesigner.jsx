import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Link, Database, Edit2, Save, X, Eye, Settings, Layout } from 'lucide-react';
import RelationshipForm from '../components/RelationshipForm';
const apiUrl = import.meta.env.VITE_API_URL;

function TableDesigner() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [newTableName, setNewTableName] = useState('');
  const [relationships, setRelationships] = useState([]);
  const [viewMode, setViewMode] = useState('design'); // 'design' or 'diagram'
  const [tablePositions, setTablePositions] = useState({});
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const diagramRef = useRef(null);

  const dataTypes = [
    'INTEGER', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'TIMESTAMP', 
    'DATE', 'DECIMAL', 'FLOAT', 'UUID', 'JSON'
  ];

  const addTable = () => {
    if (!newTableName.trim()) return;
    
    const newTable = {
      id: Date.now(),
      name: newTableName,
      fields: [
        { id: Date.now() + 1, name: 'id', type: 'INTEGER', isPrimary: true, isRequired: true }
      ]
    };
    
    setTables([...tables, newTable]);
    setNewTableName('');
    setSelectedTable(newTable.id);
    
    // Set default position for new table in diagram
    setTablePositions(prev => ({
      ...prev,
      [newTable.id]: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      }
    }));
  };

    const deleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
    setRelationships(relationships.filter(r => r.fromTable !== tableId && r.toTable !== tableId));
    setTablePositions(prev => {
      const newPos = { ...prev };
      delete newPos[tableId];
      return newPos;
    });
    if (selectedTable === tableId) {
      setSelectedTable(null);
    }
  };

    const updateTableName = (tableId, newName) => {
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, name: newName } : t
    ));
    setEditingTable(null);
  };

    const addField = (tableId) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? {
            ...t,
            fields: [
              ...t.fields,
              {
                id: Date.now(),
                name: 'new_field',
                type: 'VARCHAR(255)',
                isPrimary: false,
                isRequired: false,
                isForeignKey: false,
                referencesTable: null,
                referencesField: null
              }
            ]
          }
        : t
    ));
  };

  
  const updateField = (tableId, fieldId, updates) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? {
            ...t,
            fields: t.fields.map(f => 
              f.id === fieldId ? { ...f, ...updates } : f
            )
          }
        : t
    ));
  };

    const deleteField = (tableId, fieldId) => {
    setTables(tables.map(t => 
      t.id === tableId 
        ? { ...t, fields: t.fields.filter(f => f.id !== fieldId) }
        : t
    ));
  };

    const addRelationship = (fromTableId, fromFieldId, toTableId, toFieldId) => {
    const newRelationship = {
      id: Date.now(),
      fromTable: fromTableId,
      fromField: fromFieldId,
      toTable: toTableId,
      toField: toFieldId
    };
    
    setRelationships([...relationships, newRelationship]);
    
    // Update the field to mark it as foreign key
    updateField(fromTableId, fromFieldId, {
      isForeignKey: true,
      referencesTable: toTableId,
      referencesField: toFieldId
    });
  };

    const removeRelationship = (relationshipId) => {
    const relationship = relationships.find(r => r.id === relationshipId);
    if (relationship) {
      updateField(relationship.fromTable, relationship.fromField, {
        isForeignKey: false,
        referencesTable: null,
        referencesField: null
      });
    }
    setRelationships(relationships.filter(r => r.id !== relationshipId));
  };

    const getTableName = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    return table ? table.name : 'Unknown';
  };

  const getFieldName = (tableId, fieldId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return 'Unknown';
    const field = table.fields.find(f => f.id === fieldId);
    return field ? field.name : 'Unknown';
  };

  
  const exportSchema = async () => {
    const schema = {
      tables: tables,
      relationships: relationships,
      tablePositions: tablePositions
    };
    
    try {
      // Show loading state
      const exportButton = document.querySelector('[data-export-button]');
      if (exportButton) {
        exportButton.textContent = 'Exporting...';
        exportButton.disabled = true;
      }
      // Send data to backend (server)
      const response = await fetch(`${apiUrl}/export-schema`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tables: schema.tables , relationships: schema.relationships}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Export failed');
      }

      // Get the filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'database_schema.sql';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert('PostgreSQL schema file downloaded successfully!');

  
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      // Reset button state
      const exportButton = document.querySelector('[data-export-button]');
      if (exportButton) {
        exportButton.textContent = 'Export Schema';
        exportButton.disabled = false;
      }
    }
  };

    const handleMouseDown = (e, tableId) => {
    if (viewMode !== 'diagram') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDraggedTable(tableId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!draggedTable || viewMode !== 'diagram' || !diagramRef.current) return;
    
    const diagramRect = diagramRef.current.getBoundingClientRect();
    const newX = e.clientX - diagramRect.left - dragOffset.x;
    const newY = e.clientY - diagramRect.top - dragOffset.y;
    
    setTablePositions(prev => ({
      ...prev,
      [draggedTable]: {
        x: Math.max(0, Math.min(newX, diagramRect.width - 250)),
        y: Math.max(0, Math.min(newY, diagramRect.height - 200))
      }
    }));
  };

  const handleMouseUp = () => {
    setDraggedTable(null);
    setDragOffset({ x: 0, y: 0 });
  };

    // Add event listeners for drag functionality
  useEffect(() => {
    if (draggedTable) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedTable, dragOffset]);


    // Diagram Table Component
  const DiagramTable = ({ table, position, isSelected, onClick }) => (
    <div
      className={`absolute bg-white border-2 rounded-lg shadow-lg cursor-move select-none ${
        isSelected ? 'border-blue-500' : 'border-gray-300'
      }`}
      style={{ 
        left: position.x, 
        top: position.y, 
        width: '250px',
        zIndex: draggedTable === table.id ? 1000 : 1
      }}
      onMouseDown={(e) => handleMouseDown(e, table.id)}
      onClick={() => onClick(table.id)}
    >
      <div className="bg-gray-50 px-3 py-2 rounded-t-lg border-b">
        <h3 className="font-semibold text-gray-800">{table.name}</h3>
      </div>
      <div className="p-2">
        {table.fields.map((field) => (
          <div key={field.id} className="flex items-center justify-between py-1 text-sm">
            <div className="flex items-center gap-2">
              {field.isPrimary && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Primary Key" />
              )}
              {field.isForeignKey && (
                <Link className="w-3 h-3 text-blue-500" title="Foreign Key" />
              )}
              <span className={field.isPrimary ? 'font-semibold' : ''}>{field.name}</span>
            </div>
            <span className="text-gray-500 text-xs">{field.type}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const selectedTableData = tables.find(t => t.id === selectedTable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Database Table Designer</h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('design')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'design'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  Design
                </button>
                <button
                  onClick={() => setViewMode('diagram')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'diagram'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Layout className="w-4 h-4 inline mr-1" />
                  Diagram
                </button>
              </div>
              <button
                onClick={exportSchema}
                data-export-button
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Export Schema
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter table name..."
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTable()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTable}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Table
            </button>
          </div>
        </div>

        {viewMode === 'design' ? (
          /* Design View - Original Three Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tables List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tables</h2>
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table.id} className="group">
                    <div
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTable === table.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      <div className="flex items-center justify-between">
                        {editingTable === table.id ? (
                          <input
                            type="text"
                            defaultValue={table.name}
                            onBlur={(e) => updateTableName(table.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateTableName(table.id, e.target.value);
                              }
                            }}
                            className="font-medium bg-transparent border-b border-blue-500 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-gray-800">{table.name}</span>
                        )}
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTable(table.id);
                            }}
                            className="p-1 text-gray-500 hover:text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTable(table.id);
                            }}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {table.fields.length} fields
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedTableData ? `Fields: ${selectedTableData.name}` : 'Select a Table'}
                </h2>
                {selectedTableData && (
                  <button
                    onClick={() => addField(selectedTable)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Field
                  </button>
                )}
              </div>

              {selectedTableData ? (
                <div className="space-y-3">
                  {selectedTableData.fields.map(field => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(selectedTable, field.id, { name: e.target.value })}
                          className="font-medium bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => deleteField(selectedTable, field.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                          disabled={field.isPrimary}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          value={field.type}
                          onChange={(e) => updateField(selectedTable, field.id, { type: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {dataTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        
                        <div className="flex gap-4 text-sm">
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={field.isPrimary}
                              onChange={(e) => updateField(selectedTable, field.id, { isPrimary: e.target.checked })}
                              disabled={field.isPrimary}
                            />
                            Primary Key
                          </label>
                          <label className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={field.isRequired}
                              onChange={(e) => updateField(selectedTable, field.id, { isRequired: e.target.checked })}
                            />
                            Required
                          </label>
                        </div>
                        
                        {field.isForeignKey && (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <div className="flex items-center gap-1 text-blue-700">
                              <Link className="w-3 h-3" />
                              References: {getTableName(field.referencesTable)}.{getFieldName(field.referencesTable, field.referencesField)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Select a table to view and edit its fields
                </div>
              )}
            </div>

            {/* Relationships */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Relationships</h2>
              
              {/* Add Relationship */}
              <div className="mb-4">
                <RelationshipForm 
                  tables={tables}
                  onAddRelationship={addRelationship}
                />
              </div>

              {/* Existing Relationships */}
              <div className="space-y-2">
                {relationships.map(rel => (
                  <div key={rel.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-700">
                          <Link className="w-3 h-3" />
                          <span className="font-medium">{getTableName(rel.fromTable)}</span>
                          <span>.{getFieldName(rel.fromTable, rel.fromField)}</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          → {getTableName(rel.toTable)}.{getFieldName(rel.toTable, rel.toField)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeRelationship(rel.id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Diagram View */
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Database Diagram</h2>
              <div className="text-sm text-gray-600">
                Drag tables to rearrange • Click tables to select
              </div>
            </div>
            
            <div
              ref={diagramRef}
              className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden"
              style={{ height: '600px', minHeight: '600px' }}
            >
              {/* SVG for connection lines */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
              >
                {relationships.map((rel) => (
                  <path
                    key={rel.id}
                    d={getConnectionPath(rel.fromTable, rel.fromField, rel.toTable, rel.toField)}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                ))}
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#3b82f6"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Tables */}
              {tables.map((table) => {
                const position = tablePositions[table.id] || { x: 100, y: 100 };
                return (
                  <DiagramTable
                    key={table.id}
                    table={table}
                    position={position}
                    isSelected={selectedTable === table.id}
                    onClick={setSelectedTable}
                  />
                );
              })}

              {/* Empty state */}
              {tables.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No tables yet</p>
                    <p className="text-sm">Add a table above to get started</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Selected Table Details in Diagram View */}
            {selectedTableData && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedTableData.name} Fields
                  </h3>
                  <button
                    onClick={() => addField(selectedTable)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Field
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedTableData.fields.map(field => (
                    <div key={field.id} className="bg-white p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {field.isPrimary && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          )}
                          {field.isForeignKey && (
                            <Link className="w-3 h-3 text-blue-500" />
                          )}
                          <span className={`text-sm ${field.isPrimary ? 'font-semibold' : ''}`}>
                            {field.name}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteField(selectedTable, field.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          disabled={field.isPrimary}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">{field.type}</div>
                      {field.isForeignKey && (
                        <div className="text-xs text-blue-600 mt-1">
                          → {getTableName(field.referencesTable)}.{getFieldName(field.referencesTable, field.referencesField)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default TableDesigner