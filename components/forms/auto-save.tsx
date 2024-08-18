import React, { memo, useCallback, useEffect } from "react";
import debounce from "debounce";
import { LoaderPinwheel } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import useDeepCompareEffect from "use-deep-compare-effect";

const AutoSave = memo(({ defaultValues, onSubmit }: Props) => {
  // Get the closest form methods
  const methods = useFormContext();

  // Save if this function is called and then not called again within 1000ms
  // eslint-disable-next-line
  const debouncedSave = useCallback(
    debounce(() => {
      methods.handleSubmit(onSubmit)();
    }, 2000),
    [],
  );

  // // Watch all the data, provide with defaultValues from server, this way we know if the new data came from server or where actually edited by user
  // const watchedData = methods.watch(undefined, defaultValues);
  const watchedData = useWatch({
    control: methods.control,
    defaultValue: defaultValues,
  });

  // Can't use useEffect anymore :(
  // useEffect(() => {
  //   if (methods.formState.isDirty && methods.formState.isValid) {
  //     debouncedSave();
  //   }
  //   // eslint-disable-next-line
  // }, [watchedData]);

  // So we try something else

  useDeepCompareEffect(() => {
    if (methods.formState.isDirty) {
      debouncedSave();
    }
  }, [watchedData]);

  return (
    <div className="mt-2 flex">
      {methods.formState.isSubmitting && (
        <span className="text-gray-500 animate-pulse">Saving ...</span>
      )}
    </div>
  );
});

AutoSave.displayName = "AutoSave";

type Props = {
  defaultValues: any;
  onSubmit: any;
};

export default AutoSave;
