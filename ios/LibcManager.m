#import "LibcManager.h"
#include <mach/mach.h>
#import <sys/sysctl.h>

#if TARGET_OS_IPHONE || TARGET_IPHONE_SIMULATOR // Imports from /usr/lib/system/libsystem_kernel.dylib
// xnu-4570.1.46/osfmk/vm/vm_user.c

/*
 * Do NOT use mach_vm_read, it will cause memory leak.
 * Use mach_vm_read_overwrite instead.
 */
extern kern_return_t
mach_vm_read(
             vm_map_t               map,
             mach_vm_address_t      addr,
             mach_vm_size_t         size,
             pointer_t              *data,
             mach_msg_type_number_t *data_size);

extern kern_return_t
mach_vm_read_overwrite(
             vm_map_t           target_task,
             mach_vm_address_t  address,
             mach_vm_size_t     size,
             mach_vm_address_t  data,
             mach_vm_size_t     *outsize);

extern kern_return_t
mach_vm_write(
              vm_map_t                          map,
              mach_vm_address_t                 address,
              pointer_t                         data,
              __unused mach_msg_type_number_t   size);

extern kern_return_t
mach_vm_region(
               vm_map_t                 map,
               mach_vm_offset_t         *address,       /* IN/OUT */
               mach_vm_size_t           *size,          /* OUT */
               vm_region_flavor_t       flavor,         /* IN */
               vm_region_info_t         info,           /* OUT */
               mach_msg_type_number_t   *count,         /* IN/OUT */
               mach_port_t              *object_name);  /* OUT */

extern kern_return_t
mach_vm_region_recurse(
                       vm_map_t                 map,
                       mach_vm_address_t        *address,
                       mach_vm_size_t           *size,
                       uint32_t                 *depth,
                       vm_region_recurse_info_t info,
                       mach_msg_type_number_t   *infoCnt);

extern kern_return_t
mach_vm_protect(
                vm_map_t            map,
                mach_vm_offset_t    start,
                mach_vm_size_t      size,
                boolean_t           set_maximum,
                vm_prot_t           new_protection);

#else
#include <mach/mach_vm.h>
#endif

@implementation LibcManager

RCT_EXPORT_MODULE()

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(runningProcesses) {

    int mib[4] = {CTL_KERN, KERN_PROC, KERN_PROC_ALL, 0};
    size_t miblen = 4;

    size_t size;
    int st = sysctl(mib, miblen, NULL, &size, NULL, 0);

    struct kinfo_proc * process = NULL;
    struct kinfo_proc * newprocess = NULL;

    do {

        size += size / 10;
        newprocess = realloc(process, size);

        if (!newprocess){

            if (process){
                free(process);
            }

            return nil;
        }

        process = newprocess;
        st = sysctl(mib, miblen, process, &size, NULL, 0);

    } while (st == -1 && errno == ENOMEM);

    if (st == 0){

        if (size % sizeof(struct kinfo_proc) == 0){
            int nprocess = size / sizeof(struct kinfo_proc);

            if (nprocess) {

                NSMutableArray * array = [[NSMutableArray alloc] init];

                for (int i = nprocess - 1; i >= 0; i--){

                    NSString * processID = [[NSString alloc] initWithFormat:@"%d", process[i].kp_proc.p_pid];
                    NSString * processName = [[NSString alloc] initWithFormat:@"%s", process[i].kp_proc.p_comm];

                    NSDictionary * dict = [[NSDictionary alloc] initWithObjects:[NSArray arrayWithObjects:processID, processName, nil]
                                                                        forKeys:[NSArray arrayWithObjects:@"ProcessID", @"ProcessName", nil]];
                    [array addObject:dict];
                }

                free(process);
                return array;
            }
        }
    }

    return [NSArray init];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(mach_task_self)
{
  unsigned long long task = (unsigned long long)mach_task_self();
  return [NSNumber numberWithUnsignedLongLong:task];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(task_for_pid:(nonnull NSNumber *)task_self pid:(nonnull NSNumber *)pid)
{
  vm_map_t task_self_c = (vm_map_t)task_self.unsignedLongLongValue;
  int pid_c = pid.intValue;
  mach_port_t task_return_c = 0;
  kern_return_t ret_c = task_for_pid(task_self_c, pid_c, &task_return_c);
  return [NSArray arrayWithObjects:
    [NSNumber numberWithUnsignedLongLong:ret_c],
    [NSNumber numberWithUnsignedLongLong:task_return_c],
    nil];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(mach_vm_region:(nonnull NSNumber *)task address:(nonnull NSNumber *)address)
{
  vm_map_t task_c = (vm_map_t)task.unsignedLongLongValue;
  mach_vm_address_t address_c = (mach_vm_address_t)address.unsignedLongLongValue;
  mach_vm_size_t regionsize_c = 0;
  vm_region_flavor_t infotype_c = VM_REGION_BASIC_INFO_64;
  vm_region_basic_info_data_64_t info_c;
  mach_msg_type_number_t infocount_c = VM_REGION_BASIC_INFO_COUNT_64;
  mach_port_t objectname_c = 0;
  kern_return_t ret_c = mach_vm_region(task_c, &address_c, &regionsize_c, infotype_c, (vm_region_info_t)&info_c, &infocount_c, &objectname_c);
  NSNumber *ret_o = [NSNumber numberWithUnsignedLongLong:(unsigned long long)ret_c];
  NSNumber *address_o = [NSNumber numberWithUnsignedLongLong:(unsigned long long)address_c];
  NSNumber *regionsize_o = [NSNumber numberWithUnsignedLongLong:(unsigned long long)regionsize_c];
  NSMutableArray *info_o = [NSMutableArray array];
  //for (int i = 0; i < sizeof(info_c); i++) {
  //    NSNumber *number = [NSNumber numberWithInt:((char*)&info_c)[i]];
  //    [info_o addObject:number];
  //}
  return [NSArray arrayWithObjects:ret_o, address_o, regionsize_o, info_o, nil];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(mach_vm_read_overwrite:(nonnull NSNumber *)task address:(nonnull NSNumber *)address length:(nonnull NSNumber *)length)
{
  vm_map_t task_c = (vm_map_t)task.unsignedLongLongValue;
  mach_vm_address_t address_c = (mach_vm_address_t)address.unsignedLongLongValue;
  mach_vm_size_t length_c = (mach_vm_size_t)length.unsignedLongLongValue;
  void *data_c = malloc(length_c);
  mach_vm_size_t datasize_c = 0;
  kern_return_t ret_c = mach_vm_read_overwrite(task_c, address_c, length_c, (mach_vm_address_t)data_c, &datasize_c);
  NSNumber *ret_o = [NSNumber numberWithUnsignedLongLong:(unsigned long long)ret_c];
  NSMutableArray *data_o = [NSMutableArray array];
  for (int i = 0; i < length_c; i++) {
      NSNumber *number = [NSNumber numberWithInt:((char *)data_c)[i]];
      [data_o addObject:number];
  }
  NSNumber *datasize_o = [NSNumber numberWithUnsignedLongLong:(unsigned long long)datasize_c];
  return [NSArray arrayWithObjects:ret_o, data_o, datasize_o, nil];
}

@end
