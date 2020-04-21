import React from 'react'

function ToolBar(props: ToolBarProps) {
    return (
        <div className="toolBar">
            <button onClick={() => props.createNewEntry()}>
                ADD ENTRY
            </button>
        </div>
    );
}

interface ToolBarProps {
    createNewEntry: Function;
    queryEntries: Function;
}

export default ToolBar;
