import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { create } from "zustand";

import initialNodes from './nodes';
import initialEdges from './edges';

export interface OscData {
    frequency?: number,
    type?: string,
}

export interface GainData {
    gain?: number,
}

export interface NodesState {
    nodes: Node[],
    edges: Edge[],
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    updateNode: (id: string, data: Object) => void
}

const useStore = create<NodesState>()((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, get().nodes)})),
    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, get().edges)})),
    onConnect: (connection) => set((state) => ({ edges: addEdge(connection, get().edges)})),
    updateNode: (id: string, data: Object) => set((state) => ({ nodes:
        get().nodes.map(node => 
            node.id === id
            ? { ...node, data: { ...node.data, ...data}}    
            : node
        )
    }))
}));



export default useStore;