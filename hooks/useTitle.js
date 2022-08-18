import React, { useState, useEffect } from 'react';

export const useTitle = (initialTitle) => {
    const [title, setTitle] = useState(initialTitle);

    const updateTitle = () => {
        // const msg = get();
        // title;
    };

    useEffect(updateTitle, [title])

    return setTitle
};

const usage = () =>
{
    const titleUpdater = useTitle("Loading...");
    setTimeout(() => titleUpdater("Home"), 5000)
    return (
        <View>
            <Text>Hi</Text>
        </View>
    )
}