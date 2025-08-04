# Architectural Decision Record: State Management in our React App


## How It Works

### Initial Load

On the initial load, the [DataProvider](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#59%2C14-59%2C14) component's [useEffect](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#L94) hook triggers fetch requests for various data entities. This is done asynchronously, and the state is updated with the fetched data. The [isLoading](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#76%2C10-76%2C10) state indicates whether the data is still being fetched, allowing components to render loading indicators or fallback content.



### Side Effects

1. **Query Parameter Handling**: The context automatically selects a lead based on the [leadId](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#193%2C24-193%2C24) query parameter, affecting the [selectedLead](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#176%2C62-176%2C62) state.


2. **Error Handling**: Fetch errors are caught and logged, but not thrown, preventing the application from crashing while informing developers of issues.


3. **State Synchronization**: The [refetchData](https://github.com/senior-agent-tools/lineage-crm/blob/main/app/contexts/DataFetchContext/index.tsx#L130) function ensures that the state remains synchronized with the server, allowing for data updates without full page reloads.


## Adding New Data to the Context


### Step 1: Define New State and Fetch Data


1. Add a new state variable and setter function for your data entity.

```typescript
const [newEntity, setNewEntity] = useState([]);
```


2. Include the fetch call in the `fetchOtherData` function within the `useEffect` hook.

```typescript
fetch('/api/getNewEntity').then(res => res.json()).then(setNewEntity),
```


### Step 2: Implement Refetch Logic


1. Add a new case in the `routeMap` object within the `refetchData` function.

```typescript
getNewEntity: () => fetch('/api/getNewEntity')
  .then(res => res.json())
  .then(setNewEntity),
```


### Step 3: Share the Variable from the Provider


1. Add the new state variable and its setter function to the context provider's value.

```typescript
<DataContext.Provider value={{
  ...,
  newEntity,
  setNewEntity,
}}>
```


### Step 4: Use in Your Component

1. Use the `useData` hook to access the new data in your component.

```typescript
const { newEntity } = useData();
```


## Managing State Across Components

`DataFetchContext` provides a simpler, React-native way to manage global state, reducing boilerplate and improving maintainability compared to libraries like Redux.


## Pros and Cons vs. Redux

### Pros

- **Simplicity**: Easier setup and use.

- **React Native**: Leverages built-in React features.


- **Less Boilerplate**: Cleaner and more maintainable codebase.


### Cons


- **Scalability**: Redux may be more robust for complex state management.

- **Debugging**: Redux dev tools offer advanced debugging capabilities.

- **Performance**: Redux might perform better for high-frequency state updates.


`DataFetchContext` is designed for simplicity and functionality, offering a straightforward way to manage globaxl state while keeping the codebase clean and maintainable.


