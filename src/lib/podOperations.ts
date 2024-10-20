import { supabase } from "./supabase";
// import { Snackbar } from "@/components/ui/snackbar";

export async function joinPodSession(userId: string, podId: string) {
    // Start a transaction
    try {
    const {data, error} = await supabase.rpc('join_pod_session', {
        p_user_id: userId,
        p_pod_id: podId
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Unexpected error in joinPodSession:', error);
    return null;
  }
}

  export async function leavePodSession(userId: string, podId: string) {
    console.log('Leaving pod session for user:', userId, 'and pod:', podId);
  
    try {
      const { data: activeSession, error: findError } = await supabase
        .from('user_pod_session')
        .select('*')
        .match({ user_id: userId, pod_id: podId, is_active: true })
        .single();
  
      if (findError) {
        console.error('Error finding active session:', findError);
        return null;
      }
    
      if (!activeSession) {
        console.log('No active session found for this user in this pod');
        return null;
      }
  
      const { data: updatedSession, error: updateError } = await supabase
        .from('user_pod_session')
        .update({
          is_active: false,
          left_at: new Date().toISOString()
        })
        .eq('id', activeSession.id )
        .select();
    
      
    if (updateError) {
        console.error('Error updating user pod session:', updateError);
        return null;
    }
  
      console.log('Successfully updated session:', updatedSession);
      return updatedSession;
    } catch (error) {
      console.error('Unexpected error in leavePodSession:', error);
      return null;
    }
  }

  export async function checkPodStatus(podId: string) {
    const { data, error } = await supabase
      .from('pod')
      .select('is_active, ended_at')
      .eq('id', podId)
      .maybeSingle();
  
    if (error) throw error;
  
    return {
      isActive: data!.is_active,
      hasEnded: !!data!.ended_at
    };
  }

  export async function updatePodStatus(podId: string) {
    // Check if there are any active users in the pod
    try {
    const { data: activeSessions, error: countError } = await supabase
      .from('user_pod_session')
      .select('id')
      .match({ pod_id: podId, is_active: true }); // Ensure you're filtering active sessions
  
    if (countError) {
        console.error('Error counting active users:', countError);
        throw countError;
    }
  
    const activeUsersCount = activeSessions ? activeSessions.length : 0;
    console.log("Active users count: ", activeUsersCount);
  
    // If no active users, mark the pod as inactive and set ended_at timestamp
    if (activeUsersCount === 0) {
      const { data: updatedPod, error: updateError } = await supabase
        .from('pod')
        .update({
          is_active: false,
          ended_at: new Date().toISOString() // Set the end time
        })
        .eq('id', podId)
        .select()
        .single(); // Ensure you get the result        
  
      if (updateError) {
        console.error('Error updating pod status:', updateError);
        throw updateError;
      }
  
      console.log("Updated pod status: ", updatedPod);
      return updatedPod;
    } else {
      console.log('There are active users in the pod, not updating pod status');
      return null;
    } 
  } catch (error) {
    console.error('Unexpected error in updatePodStatus:', error);
    return null;
  }
}