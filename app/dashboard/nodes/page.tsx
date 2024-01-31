'use client';

import useStore, { NodesState } from "@/app/ui/nodes/store";
import ReactFlow, { ReactFlowProvider, Background } from "reactflow";

import 'reactflow/dist/style.css';
import { useShallow } from 'zustand/react/shallow'
 
const selector = (store: NodesState) =>  ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onConnect: store.onConnect,
});

export default function Page() {

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(useShallow(selector));

  return (
    <div style={{ width: '100vw', height: '90vh' }}>
      <ReactFlowProvider>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}