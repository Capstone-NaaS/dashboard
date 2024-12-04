import { CustomFlowbiteTheme } from "flowbite-react";

const flowbiteTheme: CustomFlowbiteTheme = {
  navbar: {
    root: {
      base: "bg-[#233142]",
    },
    link: {
      active: {
        on: "text-gray-100",
        off: "text-slate-400",
      },
    },
  },
  sidebar: {
    root: {
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded bg-[#233142] px-3 py-4 dark:bg-gray-800 ml-5",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-400 hover:bg-[#6B778D] dark:text-white dark:hover:bg-gray-700",
      active: "bg-[#6B778D] dark:bg-gray-700 text-gray-100",
      collapsed: {
        insideCollapse: "group w-full pl-8 transition duration-75",
        noIcon: "font-bold",
      },
      content: {
        base: "flex-1 whitespace-nowrap px-3",
      },
      icon: {
        base: "h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
        active: "text-[#759AC8] dark:text-gray-100",
      },
      label: "",
      listItem: "",
    },
    items: {
      base: "",
    },
    itemGroup: {
      base: "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          reverb:
            "text-offWhite bg-inherit focus:outline-none focus:ring-0 focus:border-turquoise-700",
          reverbFailure:
            "text-offWhite bg-inherit focus:outline-none focus:ring-0 focus:border-turquoise-700 border-red-700",
        },
      },
    },
  },
  table: {
    root: {
      base: "w-full text-left text-sm dark:text-gray-400 bg-[#233142] mb-4 ",
    },
    head: {
      base: "text-sm font-normal dark:text-white bg-[#233142] text-white", // Font consistency for the table header
    },
    body: {
      base: "text-sm font-normal text-gray-300 dark:text-white bg-[#233142]", // Font consistency for table body
    },
    row: {
      base: "text-sm font-normal text-gray-300 dark:text-white bg-[#233142] border-slate-700", // Font consistency for table rows
    },
  },
};

export default flowbiteTheme;
