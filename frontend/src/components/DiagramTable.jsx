import React, { useState, useRef, useEffect } from 'react';

function DiagramTable({ table, position, isSelected, onClick }) {
    const [draggedTable, setDraggedTable] = useState(null);
    const [viewMode, setViewMode] = useState('design');

      // Drag and drop functions for diagram view
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

const handleMouseUp = () => {
    setDraggedTable(null);
    setDragOffset({ x: 0, y: 0 });
  };

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


  return (
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
  )
}

export default DiagramTable