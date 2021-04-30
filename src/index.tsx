import { useMemo, useReducer } from "react";

export const DEFAULT_ACTIONS = ['ready', 'loading', 'error', 'success'] as const;

type UseStatusReturn<T extends ArrayType> = [
    Record<ActiveValue<IsActiveGuard<T>>, boolean>,
    Record<ActionTriggerName<IsActiveGuard<T>>, () => void>
];

type DefaultActionNames = DefaultActionsType[number];

type ArrayType = readonly DefaultActionNames[] | readonly string[]

/***
 * Actions: are different verbs to describe a state the flow is in (Success/Failed/ect)
 */
export default function useStatusBest<T extends ArrayType>(
    defaultActiveAction?: StatusGuard<T> | undefined | null,
    options?: T
): UseStatusReturn<T | DefaultActionNames[]> {
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

// const run = () => {
//     const [state, setter] = useStatusBest('loading', [...DEFAULT_ACTIONS, 'cat']);
//     const [state1, setter2] = useStatusBest();

//     state1.isReady
//     setter2.onReady

//     state.isCat
//     setter.onCat
// }

// Typings
type ActiveValue<T extends ArrayType> = `is${Capitalize<T[number]>}`;
type ActionTriggerName<T extends ArrayType> = `on${Capitalize<T[number]>}`;

type DefaultActionsType = typeof DEFAULT_ACTIONS;

type StatusGuard<T extends ArrayType> = T extends DefaultActionsType[]
    ? DefaultActionsType | T[number]
    : T[number];

type IsActiveGuard<T extends ArrayType> = T extends DefaultActionsType[]
    ? Array<DefaultActionsType | T[number]>
    : Array<T[number]>;

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
