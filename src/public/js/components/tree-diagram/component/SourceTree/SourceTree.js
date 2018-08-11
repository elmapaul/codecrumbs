import React from 'react';
import { withSvgDraw } from '../utils/SvgDraw';

import { FILE_NODE_TYPE, DIR_NODE_TYPE } from '../../../../../../shared/constants';
import { FolderName, FileName } from '../utils/NodeText/';
import { FolderIcon, FileIcon } from '../utils/NodeIcon/';
import { Dot } from '../utils/Dot/';
import { SourceEdge } from '../utils/Edge';

class SourceTree extends React.Component {
  render() {
    const {
      layoutNodes,
      closedFolders,
      shiftToCenterPoint,
      dependenciesDiagramOn,
      codeCrumbsMinimize,
      onFileSelect,
      onFileIconClick,
      onFolderClick
    } = this.props;
    const nodeArray = [];

    layoutNodes.each(node => {
      nodeArray.push(node);
    });

    return (
      <React.Fragment>
        {nodeArray.map((node, i) => {
          const [nX, nY] = [node.y, node.x];
          const position = shiftToCenterPoint(nX, nY);
          const name = node.data.name;

          const parent = node.parent;
          let sourcePosition = null;
          if (parent && parent.data.type === DIR_NODE_TYPE) {
            const [pX, pY] = [parent.y, parent.x];
            sourcePosition = shiftToCenterPoint(pX, pY);
          }

          return (
            <React.Fragment key={name + i}>
              {sourcePosition ? (
                <SourceEdge
                  targetPosition={position}
                  sourcePosition={sourcePosition}
                  disabled={dependenciesDiagramOn}
                  singleChild={parent.children.length === 1}
                />
              ) : null}
              <Dot position={position} disabled={dependenciesDiagramOn} />
              {node.data.type === FILE_NODE_TYPE ? (
                <React.Fragment>
                  <FileName
                    position={position}
                    name={name}
                    purple={node.children && codeCrumbsMinimize}
                    onClick={() => onFileSelect(node.data)}
                  />
                  <FileIcon
                    position={position}
                    purple={node.children && codeCrumbsMinimize}
                    onClick={() => dependenciesDiagramOn && onFileIconClick(node.data)}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FolderName position={position} name={name} disabled={dependenciesDiagramOn} />
                  <FolderIcon
                    position={position}
                    disabled={dependenciesDiagramOn}
                    closed={closedFolders[node.data.path]}
                    onClick={() => onFolderClick(node.data)}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}

export default withSvgDraw(SourceTree);
