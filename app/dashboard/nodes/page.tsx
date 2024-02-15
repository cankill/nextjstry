'use client';

import Osc from "@/app/ui/nodes/Osc";
import useStore, { NodesState } from "@/app/ui/nodes/store";
import ReactFlow, { ReactFlowProvider, Background } from "reactflow";
import { useShallow } from 'zustand/react/shallow'
import 'reactflow/dist/style.css'
import Gain from "@/app/ui/nodes/Gain";
import Out from "@/app/ui/nodes/Out";
 
const selector = (store: NodesState) =>  ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete  ,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  onConnect: store.onConnect,
});

const nodeTypes = {
  osc: Osc,
  gain: Gain,
  out: Out,
};

export default function Page() {
  const { nodes, edges, onNodesChange, onNodesDelete, onEdgesChange, onEdgesDelete, onConnect } = useStore(useShallow(selector));

  return (
    <div style={{ width: '100vw', height: '90vh' }}>
      <ReactFlowProvider>
        <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        fitView>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}