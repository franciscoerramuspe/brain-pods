import { supabase } from "./supabase";
// import { Snackbar } from "@/components/ui/snackbar";


export async function joinPodSession(userId: string, podId: string) {
  const { data: pod, error: podError } = await supabase
    .from('pod')
    .select('ended_at, is_active')
    .eq('id', podId)
    .single();

  if (podError) throw podError;

  if (pod.ended_at || !pod.is_active) {
    throw new Error("This pod has already ended");
  }

  // Check if user is already in active session for this pod
  const {data: existingSession, error: sessionError} = await supabase
    .from('user_pod_session')
    .select('id')
    .match({user_id: userId, pod_id: podId, is_active: true})
    .single();

  if (sessionError  && sessionError.code !== 'PGRST116') throw sessionError;

  if (existingSession) return existingSession; // User is already in active session for this pod

  const {data, error} = await supabase
    .from('user_pod_session')
    .insert({user_id: userId, pod_id: podId, joined_at: new Date().toISOString(), is_active: true})
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function leavePodSession(userId: string, podId: string) {
    const {error} = await supabase
        .from('user_pod_session')
        .update({is_active: false, left_at: new Date().toISOString()})
        .match({user_id: userId, pod_id: podId, is_active: true});
    
    if (error) throw error;

    await checkAndUpdatePodStatus(podId);

}

async function checkAndUpdatePodStatus(podId: string) {
    const {data, error} = await supabase
        .from('user_pod_session')
        .select('id')
        .match({pod_id: podId, is_active: true});

    if (error) throw error;

    if (data.length === 0) {
        const {error: updateError} = await supabase
            .from('pod')
            .update({ended_at: new Date().toISOString(), is_active: false})
            .match({id: podId});
        if (updateError) throw updateError;
    }
}

export async function checkPodStatus(podId: string) {
    const {data, error} = await supabase
        .from('pod')
        .select('is_active, ended_at')
        .eq('id', podId)
        .single();

    if (error) throw error;

    return {
        isActive: data.is_active,
        hasEnded: !!data.ended_at
    };
}