import React, { useEffect, useRef } from 'react'

// See: https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect
// import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect'

/**
 *  can also stop the timer passing null instead the delay or even, execute it right away passing 0.
 */
function useInterval(callback, delay) {
    const savedCallback = useRef()

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback])

    // Set up the interval.
    useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
        function tick() {
            savedCallback.current();
        }
        if (!delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval
