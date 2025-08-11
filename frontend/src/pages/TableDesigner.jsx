import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Link, Database, Edit2, Save, X, Eye, Settings, Layout } from 'lucide-react';


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





  return (
    <div>
        <h1>Web</h1>
    </div>
  )
}

export default TableDesigner