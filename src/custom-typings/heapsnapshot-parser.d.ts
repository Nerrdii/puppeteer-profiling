declare module 'heapsnapshot-parser' {
  export function parse(snapshot: string, options?: object): Snapshot;

  export interface Node {
    type: string;
    name: string;
    id: number;
    self_size: number;
    trace_node_id: number;

    toString: () => string;
    toShortString: () => string;
  }

  export interface Edge {
    type: string;
    name_or_index: string;

    toString: () => string;
  }

  export interface Snapshot {
    nodes: Node[];
    nodesById: Map<number, Node>;
    edges: Edge[];
  }
}
