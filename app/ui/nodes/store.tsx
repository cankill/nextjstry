import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, addEdge, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { create } from "zustand";

import initialNodes from './nodes';
import initialEdges from './edges';

export interface NodesState {
    nodes: Node[],
    edges: Edge[],
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
}


const useStore = create<NodesState>()((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, get().nodes)})),
    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, get().edges)})),
    onConnect: (connection) => set((state) => ({ edges: addEdge(connection, get().edges)})),
}));

export default useStore;