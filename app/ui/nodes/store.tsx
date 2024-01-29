import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { create } from "zustand";
import { nanoid } from "nanoid";

interface NodesState {
    nodes: Node[],
    edges: Edge[],
    onNodesChange: OnNodesChange,
    onEdgesChange: OnEdgesChange,
    onConnect: OnConnect,
    addEdge(data: Edge): void
}

export const useStore = create<NodesState>()((set, get) => ({
    nodes: [],
    edges: [],
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, get().nodes)})),
    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, get().edges)})),
    onConnect: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, get().edges)})),
    addEdge: (data) => {
        const id: string = nanoid(6);
        const edge: Edge = { ...data, id };
        set((state) => ({ edges: [edge, ...get().edges] }));
    },
}));