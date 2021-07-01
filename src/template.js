import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  Create,
  ShowButton,
  Filter,
} from "react-admin";
const PostTitle = ({ record }) => {
  return <span>Post {record ? `"${record.title}"` : ""}</span>;
};
const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const PostList = (props) => {
  return (
    <List {...props} filters={<PostFilter />}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <ReferenceField source="userId" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="title" />
        <ShowButton />
      </Datagrid>
    </List>
  );
};
export const EditPost = (props) => {
  return (
    <Edit {...props} title={<PostTitle />}>
      <SimpleForm>
        <ReferenceInput source="userId" reference="users">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="title" fullWidth />
        <TextInput source="body" multiline fullWidth />
      </SimpleForm>
    </Edit>
  );
};
export const CreatePost = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <ReferenceInput source="userId" reference="users">
          <SelectInput optionText="name" />
        </ReferenceInput>
        <TextInput source="title" fullWidth />
        <TextInput source="body" multiline fullWidth />
      </SimpleForm>
    </Create>
  );
};
// export const ShowPost = (props) => {
//   return (
//     <Create {...props}>
//       <SimpleForm>
//         <ReferenceInput source="userId" reference="users">
//           <SelectInput optionText="name" />
//         </ReferenceInput>
//         <TextInput source="title" fullWidth />
//         <TextInput source="body" multiline fullWidth />
//       </SimpleForm>
//     </Create>
//   );
// };
