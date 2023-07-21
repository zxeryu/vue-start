export const ProTable$ = {
  "elementProps.columns.[dataIndex,name].customRender": ({ value }: any) => {
    return <span>extra：{value}</span>;
  },
};
