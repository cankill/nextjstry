'use client';

import ReactFlow, { ReactFlowProvider, Background } from 'reactflow';

import 'reactflow/dist/style.css';
 
export default function Page() {
  return (
    <div style={{ width: '100vw', height: '90vh' }}>
      <ReactFlowProvider>
        <ReactFlow>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}