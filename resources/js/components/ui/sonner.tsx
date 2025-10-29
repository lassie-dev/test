import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600",
          success: "!bg-green-50 !border-green-500 !text-green-800 [&>*]:!text-green-800",
          error: "!bg-red-50 !border-red-500 !text-red-800 [&>*]:!text-red-800",
          warning: "!bg-yellow-50 !border-yellow-500 !text-yellow-800 [&>*]:!text-yellow-800",
          info: "!bg-blue-50 !border-blue-500 !text-blue-800 [&>*]:!text-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
