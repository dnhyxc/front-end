#### 需求说明

desc: 本文将详细的介绍如何完整的打印有横向滚动条的表格内容。

需求是这样的，当页面有几个很宽很宽的表格，它可以左右滚动，并且表格字段是根据每个表单配置来的，也就是说表格字段数量是未知的，因此，表格宽度就是未知的，在理想状态下，表格可以无限宽，只要表格字段够多的话。此时通过 `window.print()` 需要将表单内容通过 A4 纸完全打印出来。

面对这种需求，各位又当如何？

#### 难点描述

1. 由于打印按钮是通过 npm 引入的公共组件提供的，不是当前页面自己的按钮，因此当前页面并不能知道打印按钮的点击事件。那么问题就来了，如果需要在打印前做一些逻辑处理需要怎么做？

2. 如何将页面中带有左右滚动条的表格内容打印完全，而不丢失内容？

#### 如何将表格内容打印完全？

为了能让表单打印完全，主要想到了如下几种实现方式：

1. 将表格宽度设置为固定的宽度，不让它出现滚动条，这样就能打印完全了。显然这个方式是无法达到目的的，因为表格字段是未知的，所以这种方式不可取。

2. 在打印的时候，将表格去除，将字段展示由表格的展示方式替换为 key: value 的展示方式，如：

```
// 表示表格第一行
Full Name: Name  1
Age: 18
Column 1: Column no. 1-1
Column 2: Column no. 2-1
...
Column 7: Column no. 7-1
Column 8: Column no. 8-1

// 表示表格第二行
Full Name: Name  1
Age: 18
Column 1: Column no. 1-2
Column 2: Column no. 2-2
...
Column 7: Column no. 7-2
Column 8: Column no. 8-2

...

// 表示表格第8行
Full Name: Name  8
Age: 18
Column 1: Column no. 1-8
Column 2: Column no. 2-8
...
Column 7: Column no. 7-8
Column 8: Column no. 8-8

// 表示表格第9行
Full Name: Name  9
Age: 18
Column 1: Column no. 1-9
Column 2: Column no. 2-9
...
Column 7: Column no. 7-9
Column 8: Column no. 8-9
```

通过上述方式，虽然能够将表格数据打印完全，但是存在以下两个问题：

- 由于表单字段一行一个，会导致打印内容过长，原本可能只需要 2 张 A4 纸，现在需要 5、6 张 A4 纸。

- 这种打印方式打印出来的内容，不容易阅读，不能像 Table 一样直接了当。

3. 进行表格拆分，将一个表格在打印的时候拆分多个表格。这样既方便阅读，同时也能将内容打印完全。同时打印纸张也相对第二种方式减少许多。

- 表格具体的拆分思路就是将一个 column 的内容拆分成多个 column，然后进行打印即可：

```js
// 将一个 columns 的内容按照参数 size 拆分成多个 column
const chunkedColumns = (columns: ColumnType[], size: number) => {
  const columnList = [];
  for (let i = 0; i < columns.length; i += size) {
    const chunk = columns.slice(i, i + size);
    columnList.push(chunk);
  }
  return columnList;
};
```

#### 判断是否开启打印，拆分表格进行打印

找到了将表格打印完全的方案，剩下的就是如何判断是否开启打印，然后在开启打印时将表格进行拆分，然后进行打印，就大功告成了。

而想要知道是否开启打印，我们可以监听 `beforeprint` 和 `afterprint` 事件，在事件触发时，我们可以做一些逻辑处理，如下：

```js
import React, { useMemo, useState, useEffect } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface ColumnType {
  title: string;
  key: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: string;
  render?: () => void;
}

const PrintPage: React.FC = () => {
  const [isPrint, setIsPrint] = useState(false);

  // 监听打印事件
  useEffect(() => {
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const beforePrint = () => {
    setIsPrint(true);
  };
  const afterPrint = () => {
    setIsPrint(false);
  };

  const chunkedColumns = (columns: ColumnType[], size: number) => {
    const columnList = [];
    for (let i = 0; i < columns.length; i += size) {
      const chunk = columns.slice(i, i + size);
      columnList.push(chunk);
    }
    return columnList;
  };

  // 判断 isPrint，如果为 true 则表示开启了打印
  const columns: ColumnType[] | ColumnType[][] = useMemo(() => {
    const width = isPrint ? 200 : 'auto';
    const list = [
      {
        title: 'Full Name',
        width,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        width,
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width,
      },
      {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width,
      },
      {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width,
      },
      {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width,
      },
      {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
        width,
      },
      {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
        width,
      },
      {
        title: 'Column 8',
        dataIndex: 'address',
        key: '8',
        width: 200,
        fixed: 'right',
      },
    ];

    if (isPrint) {
      return chunkedColumns(list, 4);
    }
    return list;
  }, [isPrint]);

  const dataSource: DataType[] = [];

  for (let i = 0; i < 5; i++) {
    dataSource.push({
      key: i,
      name: `Name ${i}`,
      age: 18,
      address: `Column no. ${i}`,
    });
  }

  const is2DArray = (arr: ColumnType[][]) => {
    return Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]);
  };

  return (
    <div className={styles.PrintPage}>
      {is2DArray(columns as ColumnType[][]) ? (
        columns.map((i) => {
          return (
            <Table
              columns={i as ColumnsType<DataType>}
              dataSource={dataSource}
              pagination={false}
            />
          );
        })
      ) : (
        <Table
          columns={columns as ColumnsType<DataType>}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      )}
    </div>
  );
};

export default PrintPage;
```

写完上述代码，怀着必胜的信念，通过 Ctrl + P 开启打印，表格成功拆分，内容完美展现，OK 大功告成。

![ctrl + p](http://101.43.50.15/image/e3b4277853f8caad9d2576d0be8b7d11_64a7d84afc7e33b5fc378324.png)

接着页面中加入打印按钮，通过 `window.print()` 事件触发打印：

```js
const PrintPage: React.FC = () => {
  // ...

  const onPrint = () => {
    window.print();
  }

  return (
    <div className={styles.Users}>
      {is2DArray(columns as ColumnType[][]) ? (
        columns.map((i) => {
          return (
            <Table
              columns={i as ColumnsType<DataType>}
              dataSource={dataSource}
              pagination={false}
            />
          );
        })
      ) : (
        <Table
          columns={columns as ColumnsType<DataType>}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      )}
      <div className={styles.printAction}>
        <Button type="primary" className={styles.printBtn} onClick={onPrint}>
          打印
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
```

点击打印按钮进行打印，发现打印预览中的内容是这样的，并没有在打印时拆分表格：

![window.print 打印](http://101.43.50.15/image/24fddcf5b67a33710b7172a2ffe6d0e4_64a7d84afc7e33b5fc378324.png)

之所以通过 `window.print()` 打印未生效，这是因为 `window.print` 触发时，打印状态未改变，导致表格在打印时未进行拆分。既然这样，那就将 `window.print` 放到定时器中执行，看是否生效：

```js
const PrintPage: React.FC = () => {
  // ...

  let timer: ReturnType<typeof setTimeout> | null = null;

  const onPrint = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      window.print();
    });
  };

  return (
    <div className={styles.Users}>
      {is2DArray(columns as ColumnType[][]) ? (
        columns.map((i) => {
          return (
            <Table
              columns={i as ColumnsType<DataType>}
              dataSource={dataSource}
              pagination={false}
            />
          );
        })
      ) : (
        <Table
          columns={columns as ColumnsType<DataType>}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      )}
      <div className={styles.printAction}>
        <Button type="primary" className={styles.printBtn} onClick={onPrint}>
          打印
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
```

将 `window.print()` 放到定时器中，发现还是没有生效。那就只能将改变打印状态的 `setIsPrint(true)` 放到第 `onPrint` 函数中执行了，于是最终将代码改成如下形式：

```js
import React, { useMemo, useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface ColumnType {
  title: string;
  key: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: string;
  render?: () => void;
}

const PrintPage: React.FC = () => {
  const [isPrint, setIsPrint] = useState(false);

  useEffect(() => {
    window.addEventListener('afterprint', afterPrint);

    return () => {
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const afterPrint = () => {
    setIsPrint(false);
  };

  const chunkedColumns = (columns: ColumnType[], size: number) => {
    const columnList = [];
    for (let i = 0; i < columns.length; i += size) {
      const chunk = columns.slice(i, i + size);
      columnList.push(chunk);
    }
    return columnList;
  };

  const columns: ColumnType[] | ColumnType[][] = useMemo(() => {
    const width = isPrint ? 200 : 'auto';
    const list = [
      {
        title: 'Full Name',
        width,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        width,
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width,
      },
      {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width,
      },
      {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width,
      },
      {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width,
      },
      {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
        width,
      },
      {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
        width,
      },
      {
        title: 'Column 8',
        dataIndex: 'address',
        key: '8',
        width: 200,
        fixed: 'right',
      },
    ];

    if (isPrint) {
      return chunkedColumns(list, 4);
    }
    return list;
  }, [isPrint]);

  const dataSource: DataType[] = [];

  for (let i = 0; i < 5; i++) {
    dataSource.push({
      key: i,
      name: `Name ${i}`,
      age: 18,
      address: `Column no. ${i}`,
    });
  }

  let timer: ReturnType<typeof setTimeout> | null = null;

  const onPrint = () => {
    setIsPrint(true);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      window.print();
    });
  };

  return (
    <div className={styles.PrintPage}>
      {isPrint ? (
        columns.map((i, index) => {
          return (
            <Table
              key={index}
              columns={i as ColumnsType<DataType>}
              dataSource={dataSource}
              pagination={false}
            />
          );
        })
      ) : (
        <Table
          columns={columns as ColumnsType<DataType>}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      )}
      <div className={styles.printAction}>
        <Button type="primary" className={styles.printBtn} onClick={onPrint}>
          打印
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
```

通过这种实现方式在上述这个 demo 中，看起来想要的效果是实现了，但是我真正的项目中，通过上述方式是无法达到效果的，原因主要有以下几点：

1. 由于项目中的打印按钮是放在一个公共 npm 组件中的，该组件并没有向外暴露打印按钮的事件，因此，无法像上述示例中一样，在 `onPrint` 方法中通过 `setPrint(true)` 将打印状态设置为 `true`。

2. 在我真实的项目中，在 `beforeprint` 事件中，通过 `setPrint(true)` 更改 `isPrint` 打印状态，会导致页面出现卡死，这是因为 `setPrint(true)` 之后会导致页面重新渲染，而 `window.print()` 方法会阻止页面渲染，从而导致页面出现卡死。但是和上述 demo 一样，直接通过 `Ctrl + P` 触发打印，是能成功拆分表格进行打印的，但是通过 `window.print()` 就不行，具体原因目前我还没有找到准确的答案，各位如果想知道具体原因，可以自行查证。

![window.print](http://101.43.50.15/image/fce300e7c9fdaa37e4e816dca9e196cf_64a7d84afc7e33b5fc378324.png)

#### 最终实现方案

经过深思熟虑之后，发现之前的实现路存在问题，因为区分是否开启打印，不是只能通过 js 来判断的，还可以通过 css 来区分，想到这思路如同泉涌，便有了最终的实现方案，即：将打印情况下展示的表格和正常展示的表格拆分为两个组件，`PrintTable` 和 `NormalTable`。在 `indx.tsx` 中导入这两个组件，通过 css 的 `@media print` 来区分是否打印，从而实现打印时和正常展示时表格的切换：

- PrintTable.tsx 内容如下：

```js
import React, { useMemo } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface ColumnType {
  title: string;
  key: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: string;
  render?: () => void;
}

const PrintTable: React.FC<IProps> = () => {
  const chunkedColumns = (columns: ColumnType[], size: number) => {
    const columnList = [];
    for (let i = 0; i < columns.length; i += size) {
      const chunk = columns.slice(i, i + size);
      columnList.push(chunk);
    }
    return columnList;
  };

  const columns: ColumnType[] | ColumnType[][] = useMemo(() => {
    const width = 200;
    const list = [
      {
        title: 'Full Name',
        width,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        width,
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
        width,
      },
      {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
        width,
      },
      {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
        width,
      },
      {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
        width,
      },
      {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
        width,
      },
      {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
        width,
      },
      {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
        width,
      },
      {
        title: 'Column 8',
        dataIndex: 'address',
        key: '8',
        width: 200,
        fixed: 'right',
      },
    ];

    return chunkedColumns(list, 4);
  }, []);

  const dataSource: DataType[] = [];
  for (let i = 0; i < 5; i++) {
    dataSource.push({
      key: i,
      name: `Name ${i}`,
      age: 18,
      address: `Column no. ${i}`,
    });
  }

  return (
    <div className={styles.PrintTable}>
      {columns.map((i) => {
        return (
          <Table
            key={i[0].key}
            columns={i as ColumnsType<DataType>}
            dataSource={dataSource}
            pagination={false}
          />
        );
      })}
    </div>
  );
};

export default PrintTable;
```

- NormalTable.tsx 内容如下：

```js
import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface ColumnType {
  title: string;
  key: string;
  dataIndex?: string;
  width?: number | string;
  fixed?: string;
  render?: () => void;
}

const NormalTable: React.FC = () => {
  const columns: ColumnType[] | ColumnType[][] = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      key: '2',
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
      key: '3',
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
      key: '4',
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
      key: '5',
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
      key: '6',
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
      key: '7',
    },
    {
      title: 'Column 8',
      dataIndex: 'address',
      key: '8',
      width: 200,
      fixed: 'right',
    },
  ];

  const dataSource: DataType[] = [];
  for (let i = 0; i < 5; i++) {
    dataSource.push({
      key: i,
      name: `Name ${i}`,
      age: 18,
      address: `Column no. ${i}`,
    });
  }
  return (
    <div className={styles.NormalTable}>
      <Table
        columns={columns as ColumnsType<DataType>}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default NormalTable;
```

- index.tsx 内容如下：

```js
import React from "react";
import { Button } from "antd";
import PrintTable from "./PrintTable";
import NormalTable from "./NormalTable";
import styles from "./index.less";

const PrintPage: React.FC = () => {
  return (
    <div className={styles.PrintPage}>
      <PrintTable />
      <NormalTable />
      <div className={styles.printAction}>
        <Button
          type="primary"
          className={styles.printBtn}
          onClick={window.print}
        >
          打印
        </Button>
      </div>
    </div>
  );
};

export default PrintPage;
```

- index.less 内容如下：

```css
.PrintPage {
  position: relative;
  width: 100vw;
  padding: 10px;
  overflow-x: hidden;
  background-color: #fff;

  .PrintTable {
    width: 100vw;
    display: none;
  }

  .NormalTable {
    width: 100vw;
    display: block;
  }

  .printAction {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  @media print {
    .printAction {
      display: none;
    }

    .PrintTable {
      display: block;
    }

    .NormalTable {
      display: none;
    }
  }
}
```

以上就是我对该需求的最终实现方式。如果各位有更好的实现方式，我们可以相互探讨以下。
