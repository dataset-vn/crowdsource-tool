import { Block, Elem } from '../../../utils/bem';

export const Assignments = () => {
    return (
        <Block name="assignees-list">
            <Elem name="column" mix="email">Assignments</Elem>
            <Elem></Elem>
        </Block>
    );
}


Assignments.title = "Assignments";
Assignments.path = "/assignments";