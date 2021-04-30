import { useMemo, useReducer } from "react";

export const DEFAULT_ACTIONS = ['ready', 'loading', 'error', 'success'] as const;

type UseStatusReturn<T extends readonly string[]> = [
    Record<ActiveValue<T>, boolean>,
    Record<ActionTriggerName<T>, () => void>
];
/***
 * Actions: are different verbs to describe a state the flow is in (Success/Failed/ect)
 */
export default function useStatusBest<T extends readonly string[] = typeof DEFAULT_ACTIONS>(
    defaultActiveAction?: StatusGuard<T> | undefined | null,
    options?: T
): UseStatusReturn<T> {
    const [status, dispatch] = useReducer(statusReducer, defaultActiveAction, undefined);
    const optionStatusNames = options || DEFAULT_ACTIONS;

    return useMemo(() => {
        const tempSetterMap = {} as Record<string, () => void>;
        const tempState = {} as Record<string, boolean>;

        for (let optionStatusName of optionStatusNames) {
            const capitalizedOptionStatusName = `${optionStatusName[0].toUpperCase()}${optionStatusName.slice(1)}`;
            const onStatusName = `on${capitalizedOptionStatusName}`; // trigger 
            const isActionName = `is${capitalizedOptionStatusName}`; // isActive

            tempSetterMap[onStatusName] = () => dispatch({ type: 'update-status', data: optionStatusName });
            tempState[isActionName] = status === optionStatusName;
        }

        return [tempState, tempSetterMap];
    }, [status]);
}

type ActionTriggerName<T extends readonly string[]> = T extends DefaultActionsType
    ? `on${Capitalize<typeof DEFAULT_ACTIONS[number]>}`
    : `on${Capitalize<T[number]>}`

type ActiveValue<T extends readonly string[]> = T extends DefaultActionsType
    ? `is${Capitalize<typeof DEFAULT_ACTIONS[number]>}`
    : `is${Capitalize<T[number]>}`


type DefaultActionsType = typeof DEFAULT_ACTIONS;

type StatusGuard<T extends readonly string[]> = T extends DefaultActionsType
    ? DefaultActionsType[number]
    : T[number];

type Action<T> = { type: 'update-status', data: T }

// Reducers
function statusReducer<TStatus>(statusState: TStatus, action: Action<TStatus>) {
    switch (action.type) {
        case 'update-status': {
            return action.data
        }
        default: {
            return statusState;
        }
    }
}
