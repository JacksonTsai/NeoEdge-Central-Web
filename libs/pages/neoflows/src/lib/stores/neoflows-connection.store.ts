import { INeoFlowConnectionState, INeoFlowNode, INeoFlowNodeGroup, NEOFLOW_SOCKET } from '@neo-edge-web/models';
import { connectNode } from '@neo-edge-web/utils';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe } from 'rxjs';
import {
  delAllRemoveBtn,
  delConnectLine,
  delRemoveBtnByLine,
  inputSocketConnection,
  isExistConnection,
  showRemoveBtn
} from '../utils/neoflows';

// eslint-disable-next-line no-var
declare var LeaderLine: any;

const initialState: INeoFlowConnectionState = {
  sourceNodes: [],
  targetNodes: [],
  selectedNode: [],
  connection: []
};

export type NeoFlowsConnectionStore = InstanceType<typeof NeoFlowsConnectionStore>;

export const NeoFlowsConnectionStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    removeConnect(line) {
      patchState(store, {
        connection: [
          ...store.connection().filter((d) => {
            return d.start !== line.start || d.end !== line.end;
          })
        ]
      });

      delRemoveBtnByLine(line);
      delConnectLine(line);
    }
  })),
  withMethods((store) => ({
    updateSourceNodes: rxMethod<INeoFlowNodeGroup[]>(
      pipe(
        map((source) => {
          patchState(store, { sourceNodes: source });
        })
      )
    ),
    updateTargetNodes: rxMethod<INeoFlowNodeGroup[]>(
      pipe(
        map((target) => {
          patchState(store, { targetNodes: target });
        })
      )
    ),
    updateSelectedNode: rxMethod<INeoFlowNode>(
      pipe(
        map((node) => {
          if (node.socket === NEOFLOW_SOCKET.OUTPUT) {
            patchState(store, { selectedNode: [node] });
            showRemoveBtn(node, store.connection(), store.removeConnect);
          } else if (
            node.socket === NEOFLOW_SOCKET.INPUT &&
            store.selectedNode().length > 0 &&
            store.selectedNode()[0].dataClass === node.dataClass
          ) {
            if (isExistConnection(store.selectedNode()[0], node, store.connection())) {
              return;
            }
            const inputSocketExistConnLine = inputSocketConnection(node, store.connection());

            if (inputSocketExistConnLine) {
              store.removeConnect(inputSocketExistConnLine);
              delRemoveBtnByLine(inputSocketExistConnLine);
              // inputSocketExistConnLine.remove();
            }

            const line = connectNode({
              source: store.selectedNode()[0],
              target: node,
              appendRemove: true,
              delFn: store.removeConnect
            });

            const elmWrapper = document.getElementById('processor-wrapper');
            const allLine = document.querySelectorAll('.leader-line');
            const lastLine = allLine[allLine.length - 1];

            lastLine.setAttribute('data-line-start', store.selectedNode()[0].id);
            lastLine.setAttribute('data-line-end', node.id);

            elmWrapper.appendChild(lastLine);

            elmWrapper.style.transform = 'none';
            const rectWrapper = elmWrapper.getBoundingClientRect();
            elmWrapper.style.transform =
              'translate(' +
              (rectWrapper.left + pageXOffset) * -1 +
              'px, ' +
              (rectWrapper.top + pageYOffset) * -1 +
              'px)';

            line.position();

            patchState(store, { connection: [...store.connection(), line], selectedNode: [] });
            delAllRemoveBtn();
          }
        })
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        //
      }
    };
  })
);
