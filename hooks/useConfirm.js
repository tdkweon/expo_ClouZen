import React, { useState, useEffect } from 'react';

export const useConfirm = (message = "", onConfirm, onCancel) => {
    if (onConfirm && typeof onConfirm !== 'fuction') {
        return;
    }
    if (onCancel && typeof onCancel !== 'fuction') {
        return;
    }
    const confirmAction = () => {
        if(confirm(message)) {
            onConfirm();
        } else {
            onCancel()
        }
    }
    return confirmAction;
};

const usage = () =>
{
    const deleteWorld = () => console.log("Deleting...");
    const abortWorld = () => console.log("Abort...");
    const confirmDelete = useConfirm("Are you sure", deleteWorld, abortWorld);
    return (
        <View>
            <Button onClick={confirmDelete}>Delete world</Button>
        </View>
    )
}