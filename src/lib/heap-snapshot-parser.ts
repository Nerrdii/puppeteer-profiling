import _ from 'lodash';
import { CDPSession } from 'puppeteer';
import { parse as libParse, Snapshot } from 'heapsnapshot-parser';

export default class HeapSnapshotParser {
  private client: CDPSession;
  private chunks: string[];

  public constructor(client: CDPSession) {
    this.client = client;
    this.chunks = [];

    this.client.on('HeapProfiler.addHeapSnapshotChunk', ({ chunk }) => {
      this.chunks.push(chunk);
    });
  }

  public async takeSnapshot(): Promise<Snapshot> {
    await this.client.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: false,
    });

    const snapshot = libParse(this.chunks.join(''));
    this.chunks = [];
    return snapshot;
  }

  public compare(a: Snapshot, b: Snapshot): Map<string, number> {
    const first = _.countBy(a.nodes, (node) => node.name);
    const second = _.countBy(b.nodes, (node) => node.name);

    const diffs: Map<string, number> = new Map();

    for (const key in first) {
      const diff = second[key] - first[key];
      if (diff > 0 && !key.includes('system')) {
        diffs.set(key, diff);
      }
    }

    return diffs;
  }
}
