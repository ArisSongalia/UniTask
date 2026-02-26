import { useReloadContext } from '../context/ReloadContext';
import { IconAction } from './Icon';


function ReloadIcon() {
  const { reloadComponent } = useReloadContext();

  return (
    <IconAction iconOnClick={reloadComponent} dataFeather='refresh-cw'/>
  )
}

export { ReloadIcon };
