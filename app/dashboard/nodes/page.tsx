'use client';

import Osc from "@/app/ui/nodes/Osc";
import useStore, { NodesState } from "@/app/ui/nodes/store";
import ReactFlow, { ReactFlowProvider, Background, Panel, PanelPosition } from "reactflow";
import { useShallow } from 'zustand/react/shallow'
import 'reactflow/dist/style.css'
import Gain from "@/app/ui/nodes/Gain";
import Out from "@/app/ui/nodes/Out";
import { useMemo } from "react";
import styled from "styled-components";
 
const selector = (store: NodesState) =>  ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete  ,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  onConnect: store.onConnect,
  createNode: store.createNode
});

export default function Page() {

  const nodeTypes = useMemo(() => ({
      osc: Osc,
      gain: Gain,
      out: Out,
    }),
    []);
    
  const { nodes, edges, onNodesChange, onNodesDelete, onEdgesChange, onEdgesDelete, onConnect, createNode } = useStore(useShallow(selector));

  return (
    <div style={{ width: '83vw', height: '90vh' }}>
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
          <SPanel position="top-right">
            <Button onClick={() => createNode('osc')}>osc</Button>
            <Button onClick={() => createNode('gain')}>amp</Button>
          </SPanel>
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

const SPanel = styled(Panel)`
    margin-right: 1rem; /* 16px */
`;

const Button = styled.button`
    margin-left: 0.5rem;
    padding-left: 0.5rem; /* 8px */
    padding-right: 0.5rem; /* 8px */
    padding-top: 0.25rem; /* 4px */
    padding-bottom: 0.25rem; /* 4px */
    border-radius: 0.25rem; /* 4px */
    // background-color: rgb(255 255 255);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    background-color: rgb(236 72 153);
    color: rgb(255 255 255);
    font-size: 1.25rem; /* 14px */
    line-height: 1.25rem; /* 20px */
    font-weight: 300;
`;
