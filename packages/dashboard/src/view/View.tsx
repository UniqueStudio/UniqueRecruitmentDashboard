import * as React from "react";
import { withStyles } from "@material-ui/core";

import withRoot from "../style/withRoot";
import styles from "../style/index";
import Column from "../container/Column";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class View extends React.Component<any> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.columnContainer}>
                <Column title="报名流程" />
                <Column title="笔试流程" />
                <Column title="面试流程" />
                <Column title="熬测流程" />
                <Column title="群面流程" />
                {/*this div with a full-width-space is used to show right margin of the last element*/}
                <div style={{visibility: 'hidden'}}>　</div>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(View));
